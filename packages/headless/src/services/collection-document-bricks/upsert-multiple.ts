import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import type { BrickSchemaT } from "../../schemas/collection-bricks.js";
import type { FieldCollectionSchemaT } from "../../schemas/collection-fields.js";
import collectionBricksServices from "./index.js";
import serviceWrapper from "../../utils/service-wrapper.js";

export interface ServiceData {
	document_id: number;
	bricks?: Array<BrickSchemaT>;
	fields: Array<FieldCollectionSchemaT>;
	collection_key: string;
}

const upsertMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const noBricks =
		data.bricks === undefined ? false : data.bricks.length === 0;
	const bricksLength = data.bricks?.length || 0;
	let bricks = data.bricks || [];

	const collectionContentBrick = await serviceConfig.db
		.selectFrom("headless_collection_document_bricks")
		.select("id")
		.where("collection_document_id", "=", data.document_id)
		.where("brick_type", "=", "collection-fields")
		.executeTakeFirst();

	if (collectionContentBrick !== undefined) {
		bricks.push({
			id: collectionContentBrick?.id,
			type: "collection-fields",
			groups: [],
			fields: data.fields,
		});
	} else {
		bricks.push({
			type: "collection-fields",
			groups: [],
			fields: data.fields,
		});
	}

	if (bricks.length === 0) return;

	// validation
	collectionBricksServices.checks.checkDuplicateOrder(bricks);
	await collectionBricksServices.checks.checkValidateBricks(serviceConfig, {
		collection_key: data.collection_key,
		bricks: bricks,
	});

	// upsert bricks and return all the ids, order and key
	const bricksRes = await serviceConfig.db
		.insertInto("headless_collection_document_bricks")
		.values(
			bricks.map((brick) => {
				return {
					id: typeof brick.id === "string" ? undefined : brick.id,
					brick_type: brick.type,
					brick_key: brick.key,
					brick_order: brick.order,
					collection_document_id: data.document_id,
				};
			}),
		)
		.onConflict((oc) =>
			oc.column("id").doUpdateSet((eb) => ({
				brick_order: eb.ref("excluded.brick_order"),
			})),
		)
		.returning(["id", "brick_order", "brick_key", "brick_type"])
		.execute();

	// update data.bricks with the new ids where key and order match
	bricks = bricks.map((brick) => {
		const foundBrick = bricksRes.find((res) => {
			if (brick.type === "collection-fields") {
				return res.brick_type === brick.type;
			}

			return (
				res.brick_key === brick.key &&
				res.brick_order === brick.order &&
				res.brick_type === brick.type
			);
		});
		if (!foundBrick) {
			throw new APIError({
				type: "basic",
				name: T("error_saving_bricks"),
				message: T("there_was_an_error_updating_bricks"),
				status: 400,
			});
		}

		return {
			id: foundBrick.id,
			key: brick.key,
			order: brick.order,
			type: brick.type,
			groups: brick.groups,
			fields: brick.fields,
		};
	});

	// upsert groups
	const groupsRes = await serviceWrapper(
		collectionBricksServices.upsertMultipleGroups,
		false,
	)(serviceConfig, {
		document_id: data.document_id,
		bricks: bricks,
	});

	await Promise.all([
		// upsert fields
		serviceWrapper(collectionBricksServices.upsertMultipleFields, false)(
			serviceConfig,
			{
				document_id: data.document_id,
				bricks: bricks,
				groups: groupsRes.groups,
			},
		),
		// delete multiple bricks
		serviceWrapper(collectionBricksServices.deleteMultipleBricks, false)(
			serviceConfig,
			{
				apply: noBricks || bricksLength > 0,
				document_id: data.document_id,
				bricks: bricksRes.filter(
					(res) => res.brick_type !== "collection-fields",
				),
			},
		),
		// group delete, parent update
		...groupsRes.promises,
	]);
};

export default upsertMultiple;
