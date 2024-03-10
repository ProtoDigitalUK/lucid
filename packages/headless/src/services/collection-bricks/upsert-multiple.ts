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

	const groups = await serviceWrapper(
		collectionBricksServices.upsertMultipleGroups,
		false,
	)(serviceConfig, {
		bricks: data.bricks,
	});
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

export default upsertMultiple;
