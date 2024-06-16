import Repository from "../../libs/repositories/index.js";
import formatInsertBricks from "./helpers/format-insert-bricks.js";
import formatPostInsertBricks from "./helpers/format-post-insert-bricks.js";
import formatInsertFields from "./helpers/format-insert-fields.js";
import LucidServices from "../index.js";
import type { ServiceFn } from "../../libs/services/types.js";
import type CollectionBuilder from "../../libs/builders/collection-builder/index.js";
import type { BrickSchema } from "../../schemas/collection-bricks.js";
import type { FieldSchemaType } from "../../schemas/collection-fields.js";

const createMultiple: ServiceFn<
	[
		{
			documentId: number;
			bricks?: Array<BrickSchema>;
			fields?: Array<FieldSchemaType>;
			collection: CollectionBuilder;
		},
	],
	undefined
> = async (service, data) => {
	const CollectionDocumentBricksRepo = Repository.get(
		"collection-document-bricks",
		service.db,
	);

	// -------------------------------------------------------------------------------
	// set bricks
	const bricks = formatInsertBricks({
		bricks: data.bricks,
		fields: data.fields,
		documentId: data.documentId,
		localisation: service.config.localisation,
		collection: data.collection,
	});
	if (bricks.length === 0) {
		return {
			error: undefined,
			data: undefined,
		};
	}

	// -------------------------------------------------------------------------------
	// validation
	const checkBrickOrder =
		LucidServices.collection.document.brick.checks.checkDuplicateOrder(
			bricks,
		);
	if (checkBrickOrder.error) return checkBrickOrder;

	const checkValidateBricksFields =
		await LucidServices.collection.document.brick.checks.checkValidateBricksFields(
			service,
			{
				collection: data.collection,
				bricks: bricks,
			},
		);
	if (checkValidateBricksFields.error) return checkValidateBricksFields;

	// -------------------------------------------------------------------------------
	// delete all bricks
	const deleteAllBricks =
		await LucidServices.collection.document.brick.deleteMultipleBricks(
			service,
			{
				documentId: data.documentId,
				apply: {
					bricks: data.bricks !== undefined,
					collectionFields: data.fields !== undefined,
				},
			},
		);
	if (deleteAllBricks.error) return deleteAllBricks;

	// -------------------------------------------------------------------------------
	// insert bricks
	const bricksRes = await CollectionDocumentBricksRepo.createMultiple({
		items: bricks.map((b) => ({
			brickType: b.type,
			brickKey: b.key,
			brickOrder: b.order,
			brickOpen: b.open,
			collectionDocumentId: data.documentId,
		})),
	});

	const postInsertBricks = formatPostInsertBricks(bricks, bricksRes);

	// -------------------------------------------------------------------------------
	// create groups
	const groups =
		await LucidServices.collection.document.brick.createMultipleGroups(
			service,
			{
				documentId: data.documentId,
				brickGroups: postInsertBricks.map((b) => ({
					brickId: b.id,
					groups: b.groups,
				})),
			},
		);
	if (groups.error) return groups;

	// -------------------------------------------------------------------------------
	// create fields
	const fields =
		await LucidServices.collection.document.brick.createMultipleFields(
			service,
			{
				documentId: data.documentId,
				fields: postInsertBricks.flatMap((b) =>
					formatInsertFields({
						groups: groups.data,
						brick: b,
						collection: data.collection,
					}),
				),
			},
		);
	if (fields.error) return fields;

	return {
		error: undefined,
		data: undefined,
	};
};

export default createMultiple;
