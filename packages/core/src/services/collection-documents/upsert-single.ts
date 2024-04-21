import T from "../../translations/index.js";
import { HeadlessAPIError } from "../../utils/error-handler.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import collectionDocumentsServices from "./index.js";
import collectionDocumentBricksServices from "../collection-document-bricks/index.js";
import Repository from "../../libs/repositories/index.js";
import executeHooks from "../../libs/hooks/execute-hooks.js";
import merge from "lodash.merge";
import type { BrickSchema } from "../../schemas/collection-bricks.js";
import type { FieldSchemaType } from "../../schemas/collection-fields.js";
import type { GroupSchemaType } from "../../schemas/collection-groups.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	collectionKey: string;
	userId: number;

	documentId?: number;
	bricks?: Array<BrickSchema>;
	fields?: Array<FieldSchemaType>;
	groups?: Array<GroupSchemaType>;
}

const upsertSingle = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const collectionInstance =
		await collectionDocumentsServices.checks.checkCollection({
			key: data.collectionKey,
		});

	const CollectionDocumentsRepo = Repository.get(
		"collection-documents",
		serviceConfig.db,
	);

	if (data.documentId !== undefined) {
		const existingDocument = await CollectionDocumentsRepo.selectSingle({
			select: ["id"],
			where: [
				{
					key: "id",
					operator: "=",
					value: data.documentId,
				},
				{
					key: "collection_key",
					operator: "=",
					value: data.collectionKey,
				},
			],
		});

		if (existingDocument === undefined) {
			throw new HeadlessAPIError({
				type: "basic",
				name: T("error_not_found_name", {
					name: T("document"),
				}),
				message: T("error_not_found_message", {
					name: T("document"),
				}),
				status: 404,
			});
		}

		if (collectionInstance.config.locked === true) {
			throw new HeadlessAPIError({
				type: "basic",
				name: T("error_locked_collection_name"),
				message: T("error_locked_collection_message", {
					name: collectionInstance.data.title,
				}),
				status: 400,
			});
		}
	}

	await Promise.all([
		serviceWrapper(
			collectionDocumentsServices.checks
				.checkSingleCollectionDocumentCount,
			false,
		)(serviceConfig, {
			collectionKey: data.collectionKey,
			collectionMode: collectionInstance.data.mode,
			documentId: data.documentId,
		}),
	]);

	const hookResponse = await executeHooks(
		{
			service: "collection-documents",
			event: "beforeUpsert",
			config: serviceConfig.config,
			collectionInstance: collectionInstance,
		},
		{
			db: serviceConfig.db,
			meta: {
				collectionKey: data.collectionKey,
				userId: data.userId,
			},
			data: data,
		},
	);
	const bodyData = merge(data, hookResponse);

	const document = await CollectionDocumentsRepo.upsertSingle({
		id: data.documentId,
		collectionKey: data.collectionKey,
		createdBy: data.userId,
		updatedBy: data.userId,
		isDeleted: 0,
	});

	if (document === undefined) {
		throw new HeadlessAPIError({
			type: "basic",
			status: 400,
		});
	}

	await serviceWrapper(
		collectionDocumentBricksServices.createMultiple,
		false,
	)(serviceConfig, {
		documentId: document.id,
		bricks: bodyData.bricks,
		fields: bodyData.fields,
		groups: bodyData.groups,
		collectionKey: data.collectionKey,
	});

	await executeHooks(
		{
			service: "collection-documents",
			event: "afterUpsert",
			config: serviceConfig.config,
			collectionInstance: collectionInstance,
		},
		{
			db: serviceConfig.db,
			meta: {
				collectionKey: data.collectionKey,
				userId: data.userId,
			},
			data: {
				documentId: document.id,
				bricks: bodyData.bricks,
				fields: bodyData.fields,
			},
		},
	);

	return document.id;
};

export default upsertSingle;
