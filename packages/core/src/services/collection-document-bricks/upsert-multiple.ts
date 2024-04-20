import T from "../../translations/index.js";
import { HeadlessAPIError } from "../../utils/error-handler.js";
import type { BrickSchema } from "../../schemas/collection-bricks.js";
import type { GroupSchemaType } from "../../schemas/collection-groups.js";
import type { FieldSchemaType } from "../../schemas/collection-fields.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";
import collectionBricksServices from "./index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	documentId: number;
	bricks?: Array<BrickSchema>;
	fields?: Array<FieldSchemaType>;
	groups?: Array<GroupSchemaType>;
	collectionKey: string;
}

const upsertMultiple = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const CollectionDocumentBricksRepo = Repository.get(
		"collection-document-bricks",
		serviceConfig.db,
	);

	// set bricks
	let bricks = data.bricks || [];

	bricks = await addCollectionSudoBrick(serviceConfig, {
		fields: data.fields,
		groups: data.groups,
		documentId: data.documentId,
		bricks: bricks,
	});

	if (bricks.length === 0) return;

	// validation
	collectionBricksServices.checks.checkDuplicateOrder(bricks);
	await collectionBricksServices.checks.checkValidateBricks(serviceConfig, {
		collectionKey: data.collectionKey,
		bricks: bricks,
	});

	// upsert bricks and return all the ids, order and key
	const bricksRes = await CollectionDocumentBricksRepo.upsertMultiple({
		items: bricks.map((b) => ({
			id: typeof b.id === "string" ? undefined : b.id,
			brickType: b.type,
			brickKey: b.key,
			brickOrder: b.order,
			collectionDocumentId: data.documentId,
		})),
	});

	// assign the ids to the bricks
	bricks = assignBrickIdsFromUpsert(bricks, bricksRes);

	// upsert groups
	// TODO: take a look at this function and how it mutates bricks
	const groupsRes = await serviceWrapper(
		collectionBricksServices.upsertMultipleGroups,
		false,
	)(serviceConfig, {
		documentId: data.documentId,
		bricks: bricks,
	});

	await Promise.all([
		// upsert fields
		serviceWrapper(collectionBricksServices.upsertMultipleFields, false)(
			serviceConfig,
			{
				documentId: data.documentId,
				bricks: bricks,
				groups: groupsRes.groups,
			},
		),
		// delete multiple bricks
		serviceWrapper(collectionBricksServices.deleteMultipleBricks, false)(
			serviceConfig,
			{
				documentId: data.documentId,
				bricks: bricksRes,
				apply: {
					bricks: data.bricks !== undefined,
					collectionFields: upsertCollectionSudoBrick(
						data.fields,
						data.groups,
					),
				},
			},
		),
		// group delete, parent update
		...groupsRes.promises,
	]);
};

const upsertCollectionSudoBrick = (
	fields?: Array<FieldSchemaType>,
	groups?: Array<GroupSchemaType>,
) => {
	if (fields === undefined && groups === undefined) return false;
	return true;
};

const addCollectionSudoBrick = async (
	serviceConfig: ServiceConfig,
	data: {
		fields?: Array<FieldSchemaType>;
		groups?: Array<GroupSchemaType>;
		documentId: number;
		bricks: Array<BrickSchema>;
	},
) => {
	if (!upsertCollectionSudoBrick(data.fields)) return data.bricks;

	const CollectionDocumentBricksRepo = Repository.get(
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
					value: data.documentId,
				},
				{
					key: "brick_type",
					operator: "=",
					value: "collection-fields",
				},
			],
		});

	if (collectionContentBrick !== undefined) {
		data.bricks.push({
			id: collectionContentBrick?.id,
			type: "collection-fields",
			groups: data.groups,
			fields: data.fields,
		});
	} else {
		data.bricks.push({
			type: "collection-fields",
			groups: data.groups,
			fields: data.fields,
		});
	}

	return data.bricks;
};

const assignBrickIdsFromUpsert = (
	bricks: Array<BrickSchema>,
	upsertedBricks: Array<{
		id: number;
		brick_type: "builder" | "fixed" | "collection-fields";
		brick_key: string | null;
		brick_order: number | null;
	}>,
) => {
	return bricks.map((brick) => {
		const foundBrick = upsertedBricks.find(
			(res) =>
				res.brick_key === (brick.key ?? null) &&
				res.brick_order === (brick.order ?? null) &&
				res.brick_type === brick.type,
		);

		if (!foundBrick) {
			throw new HeadlessAPIError({
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
};

export default upsertMultiple;
