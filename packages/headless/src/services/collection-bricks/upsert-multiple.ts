import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import type { BrickObjectT } from "../../schemas/bricks.js";
import collectionBricksServices from "./index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import { jsonArrayFrom } from "kysely/helpers/postgres";

export interface ServiceData {
	id: number;
	type: "multiple-page" | "single-page";
	bricks: Array<BrickObjectT>;
}

const upsertMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	let existingIdsQuery = serviceConfig.db
		.selectFrom("headless_collection_bricks")
		.select((eb) => [
			"headless_collection_bricks.id",
			jsonArrayFrom(
				eb
					.selectFrom("headless_groups")
					.select("group_id")
					.whereRef(
						"headless_groups.collection_brick_id",
						"=",
						"headless_groups.group_id",
					),
			).as("groups"),
			jsonArrayFrom(
				eb
					.selectFrom("headless_fields")
					.select("fields_id")
					.whereRef(
						"headless_fields.collection_brick_id",
						"=",
						"headless_fields.fields_id",
					),
			).as("fields"),
		]);

	if (data.type === "multiple-page") {
		existingIdsQuery = existingIdsQuery.where(
			"multiple_page_id",
			"=",
			data.id,
		);
	} else {
		existingIdsQuery = existingIdsQuery.where(
			"single_page_id",
			"=",
			data.id,
		);
	}

	const existingIds = await existingIdsQuery.execute();

	// upsert bricks and return all the ids, order and key
	const bricksRes = await serviceConfig.db
		.insertInto("headless_collection_bricks")
		.values(
			data.bricks.map((brick) => {
				return {
					id: typeof brick.id === "string" ? undefined : brick.id,
					brick_type: brick.type,
					brick_key: brick.key,
					brick_order: brick.order,
					multiple_page_id:
						data.type === "multiple-page" ? data.id : null,
					single_page_id:
						data.type === "single-page" ? data.id : null,
				};
			}),
		)
		.onConflict((oc) =>
			oc.column("id").doUpdateSet((eb) => ({
				brick_order: eb.ref("excluded.brick_order"),
			})),
		)
		.returning(["id", "brick_order", "brick_key"])
		.execute();

	// update data.bricks with the new ids where key and order match
	data.bricks = assignBrickIds(data.bricks, bricksRes);

	const newGroups = await serviceWrapper(
		collectionBricksServices.createMultipleGroups,
		false,
	)(serviceConfig, { bricks: data.bricks });

	// update data.bricks with the new group ids
	const groups = assignGroupsParentIds(data.bricks, newGroups);

	// update existing groups with order and parent_group_id
};

const assignBrickIds = (
	bricks: Array<BrickObjectT>,
	brickUpdateRes: Array<{
		id: number;
		brick_order: number;
		brick_key: string;
	}>,
) => {
	return bricks.map((brick) => {
		const foundBrick = brickUpdateRes.find(
			(res) =>
				res.brick_key === brick.key && res.brick_order === brick.order,
		);
		if (!foundBrick) throw new Error("Brick not found");

		return {
			id: foundBrick.id,
			key: brick.key,
			order: brick.order,
			type: brick.type,
			groups: brick.groups,
			fields: brick.fields,
		};
	});
};

const assignGroupsParentIds = (
	bricks: Array<BrickObjectT>,
	groups: Array<{
		group_id: number;
		ref: string;
	}>,
) => {
	const newGroupMap: { [key: string]: number } = {};
	for (const group of groups) {
		newGroupMap[group.ref] = group.group_id;
	}
	const allGroups = [];

	for (const brick of bricks) {
		if (!brick.groups) continue;

		for (const group of brick.groups) {
			if (!group.parent_group_id) {
				allGroups.push(group);
				continue;
			}

			if (newGroupMap[group.parent_group_id]) {
				group.parent_group_id = newGroupMap[group.parent_group_id];
				allGroups.push(group);
			}
		}
	}

	return allGroups;
};

export default upsertMultiple;
