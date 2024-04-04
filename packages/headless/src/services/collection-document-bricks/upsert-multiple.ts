import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import type { BrickSchemaT } from "../../schemas/collection-bricks.js";
import type { FieldCollectionSchemaT } from "../../schemas/collection-fields.js";
import collectionBricksServices from "./index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import RepositoryFactory from "../../libs/repositories/index.js";

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

	const CollectionDocumentBricksRepo = RepositoryFactory.getRepository(
		"collection-document-bricks",
		serviceConfig.db,
	);

	const collectionContentBrick =
		await CollectionDocumentBricksRepo.selectSingle({
			select: ["id"],
			where: [
				{
					key: "collection_document_id",
					operator: "=",
					value: data.document_id,
				},
				{
					key: "brick_type",
					operator: "=",
					value: "collection-fields",
				},
			],
		});

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
	const bricksRes = await CollectionDocumentBricksRepo.upsertMultiple({
		items: bricks.map((b) => ({
			id: typeof b.id === "string" ? undefined : b.id,
			brickType: b.type,
			brickKey: b.key,
			brickOrder: b.order,
			collectionDocumentId: data.document_id,
		})),
	});

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
