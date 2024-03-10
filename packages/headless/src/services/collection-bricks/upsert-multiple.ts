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

	const groupsRes = await serviceConfig.db
		.insertInto("headless_groups")
		.values(
			data.bricks.flatMap((brick) => {
				if (!brick.groups) return [];

				return brick.groups.map((group) => {
					return {
						group_id:
							typeof group.group_id === "string"
								? undefined
								: group.group_id,
						parent_group_id:
							typeof group.parent_group_id === "string"
								? undefined
								: group.parent_group_id,
						collection_brick_id: brick.id as number,
						group_order: group.group_order,
						repeater_key: group.repeater_key,
						language_id: group.language_id,
						ref:
							typeof group.group_id === "string"
								? group.group_id
								: undefined,
					};
				});
			}),
		)
		.onConflict((oc) =>
			oc.column("group_id").doUpdateSet((eb) => ({
				group_order: eb.ref("excluded.group_order"),
				parent_group_id: eb.ref("excluded.parent_group_id"),
				ref: eb.ref("excluded.ref"),
			})),
		)
		.returning(["group_id", "ref"])
		.execute();

	// TODO: if data.bricks.groups has a parent_group_id, update the parent_group_id with the new group id. Also update group_id if it's a ref
	const groups = data.bricks.flatMap((brick) => {
		if (!brick.groups) return [];
		return brick.groups.map((group) => {
			if (
				typeof group.group_id === "string" &&
				group.group_id.startsWith("ref-")
			) {
				const foundGroup = groupsRes.find(
					(res) => res.ref === group.group_id,
				);
				if (!foundGroup) throw new Error("Group not found");
				group.group_id = foundGroup.group_id;
			}
			if (
				typeof group.parent_group_id === "string" &&
				group.parent_group_id.startsWith("ref-")
			) {
				const foundGroup = groupsRes.find(
					(res) => res.ref === group.parent_group_id,
				);
				if (!foundGroup) throw new Error("Group not found");
				group.parent_group_id = foundGroup.group_id;
			}

			return group;
		});
	});
	// TODO: update groups by the id with their new parent_group_id
	const updatedGroups = await serviceConfig.db
		.insertInto("headless_groups")
		.values(
			groups.map((group) => {
				return {
					group_id: group.group_id as number,
					parent_group_id: group.parent_group_id as number | null,
					group_order: group.group_order as number,
					repeater_key: group.repeater_key,
					language_id: group.language_id,
				};
			}),
		)
		.onConflict((oc) =>
			oc.column("group_id").doUpdateSet((eb) => ({
				parent_group_id: eb.ref("excluded.parent_group_id"),
			})),
		)
		.execute();

	// TODO: update data.bricks fields with the new group ids
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

// const assignGroupsParentIds = (
// 	bricks: Array<BrickObjectT>,
// 	groups: Array<{
// 		group_id: number;
// 		ref: string;
// 	}>,
// ) => {
// 	const newGroupMap: { [key: string]: number } = {};
// 	for (const group of groups) {
// 		newGroupMap[group.ref] = group.group_id;
// 	}
// 	const allGroups = [];

// 	for (const brick of bricks) {
// 		if (!brick.groups) continue;

// 		for (const group of brick.groups) {
// 			if (!group.parent_group_id) {
// 				allGroups.push(group);
// 				continue;
// 			}

// 			if (newGroupMap[group.parent_group_id]) {
// 				group.parent_group_id = newGroupMap[group.parent_group_id];
// 				allGroups.push(group);
// 			}
// 		}
// 	}

// 	return allGroups;
// };

export default upsertMultiple;
