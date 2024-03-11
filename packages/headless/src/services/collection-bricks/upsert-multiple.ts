import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import type { BrickObjectT } from "../../schemas/bricks.js";
import collectionBricksServices from "./index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

export interface ServiceData {
	id: number;
	type: "multiple-page" | "single-page";
	bricks: Array<BrickObjectT>;
}

const upsertMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
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

	// upsert groups
	const groupsRes = await serviceWrapper(
		collectionBricksServices.upsertMultipleGroups,
		false,
	)(serviceConfig, {
		bricks: data.bricks,
	});

	Promise.all([
		// upsert fields
		serviceWrapper(collectionBricksServices.upsertMultipleFields, false)(
			serviceConfig,
			{
				bricks: data.bricks,
				groups: groupsRes.groups,
			},
		),
		// delete multiple bricks
		serviceWrapper(collectionBricksServices.deleteMultipleBricks, false)(
			serviceConfig,
			{
				id: data.id,
				type: data.type,
				bricks: bricksRes,
			},
		),
		// group delete, parent update
		...groupsRes.promises,
	]);
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
