import type { BrickSchema } from "../../schemas/collection-bricks.js";
import type { FieldSchemaType } from "../../schemas/collection-fields.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";
import Repository from "../../libs/repositories/index.js";
import formatInsertBricks from "./helpers/format-insert-bricks.js";
import formatPostInsertBricks from "./helpers/format-post-insert-bricks.js";
import formatInsertFields from "./helpers/format-insert-fields.js";
import collectionBricksServices from "./index.js";
import serviceWrapper from "../../utils/service-wrapper.js";

export interface ServiceData {
	documentId: number;
	bricks?: Array<BrickSchema>;
	fields?: Array<FieldSchemaType>;
	collectionKey: string;
}

/*
    TODO: Currently if you send an update that only contains one set of translations, all other translations are deleted.

    * There are two options to fix this: *
    
    - Bricks need to not delete all and just delete the ones not specified in the bricks array
    - Bricks createMultiple needs to be changed to an upsert
    - Fields need to delete all that are of the same collection_document_id and language_id
    - Groups need to delete all that are of the same collection_document_id and language_id (language_id is not implemented yet)

    or 

    - Frontend needs to fetch all translations and send them to the upsert at the same time instead of being seperate
*/

const createMultiple = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const CollectionDocumentBricksRepo = Repository.get(
		"collection-document-bricks",
		serviceConfig.db,
	);

	// -------------------------------------------------------------------------------
	// set bricks
	const bricks = formatInsertBricks({
		bricks: data.bricks,
		fields: data.fields,
		documentId: data.documentId,
	});
	if (bricks.length === 0) return;

	// -------------------------------------------------------------------------------
	// validation
	collectionBricksServices.checks.checkDuplicateOrder(bricks);
	await collectionBricksServices.checks.checkValidateBricks(serviceConfig, {
		collectionKey: data.collectionKey,
		bricks: bricks,
	});

	// -------------------------------------------------------------------------------
	// delete all bricks
	await serviceWrapper(collectionBricksServices.deleteMultipleBricks, false)(
		serviceConfig,
		{
			documentId: data.documentId,
			apply: {
				bricks: data.bricks !== undefined,
				collectionFields: data.fields !== undefined,
			},
		},
	);

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
	const groups = await serviceWrapper(
		collectionBricksServices.createMultipleGroups,
		false,
	)(serviceConfig, {
		documentId: data.documentId,
		brickGroups: postInsertBricks.map((b) => ({
			brickId: b.id,
			groups: b.groups,
		})),
	});

	// -------------------------------------------------------------------------------
	// create fields
	await serviceWrapper(collectionBricksServices.createMultipleFields, false)(
		serviceConfig,
		{
			documentId: data.documentId,
			fields: postInsertBricks.flatMap((b) =>
				formatInsertFields({
					groups: groups,
					brickId: b.id,
					fields: b.fields,
				}),
			),
		},
	);
};

export default createMultiple;
