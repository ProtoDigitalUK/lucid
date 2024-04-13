import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import collectionDocumentsServices from "./index.js";
import collectionDocumentBricksServices from "../collection-document-bricks/index.js";
import { upsertErrorContent } from "../../utils/helpers.js";
import Repository from "../../libs/repositories/index.js";
import executeHooks from "../../libs/hooks/execute-hooks.js";
import merge from "lodash.merge";
import type { BrickSchemaT } from "../../schemas/collection-bricks.js";
import type { FieldCollectionSchemaT } from "../../schemas/collection-fields.js";

export interface CollectionDocumentUpsertData {
	document_id?: number;
	bricks?: Array<BrickSchemaT>;
	fields?: Array<FieldCollectionSchemaT>;
}

export interface ServiceData {
	collection_key: string;
	user_id: number;
	data: CollectionDocumentUpsertData;
}

const upsertSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const errorContent = upsertErrorContent(
		data.data.document_id === undefined,
		T("document"),
	);

	const collectionInstance =
		await collectionDocumentsServices.checks.checkCollection({
			key: data.collection_key,
			errorContent: errorContent,
		});

	const CollectionDocumentsRepo = Repository.get(
		"collection-documents",
		serviceConfig.db,
	);

	if (data.data.document_id !== undefined) {
		const existingDocument = await CollectionDocumentsRepo.selectSingle({
			select: ["id"],
			where: [
				{
					key: "id",
					operator: "=",
					value: data.data.document_id,
				},
				{
					key: "collection_key",
					operator: "=",
					value: data.collection_key,
				},
			],
		});

		if (existingDocument === undefined) {
			throw new APIError({
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
	}

	await Promise.all([
		serviceWrapper(
			collectionDocumentsServices.checks
				.checkSingleCollectionDocumentCount,
			false,
		)(serviceConfig, {
			collection_key: data.collection_key,
			collection_mode: collectionInstance.data.mode,
			document_id: data.data.document_id,
			errorContent: errorContent,
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
			meta: {
				collection_key: data.collection_key,
				user_id: data.user_id,
			},
			data: data.data,
		},
	);
	const bodyData = merge(data.data, hookResponse);

	const document = await CollectionDocumentsRepo.upsertSingle({
		id: data.data.document_id,
		collectionKey: data.collection_key,
		authorId: data.user_id,
		createdBy: data.user_id,
		updatedBy: data.user_id,
		isDeleted: 0,
	});

	if (document === undefined) {
		throw new APIError({
			type: "basic",
			name: errorContent.name,
			message: errorContent.message,
			status: 400,
		});
	}

	await serviceWrapper(
		collectionDocumentBricksServices.upsertMultiple,
		false,
	)(serviceConfig, {
		document_id: document.id,
		bricks: bodyData.bricks,
		fields: bodyData.fields,
		collection_key: data.collection_key,
	});

	await executeHooks(
		{
			service: "collection-documents",
			event: "afterUpsert",
			config: serviceConfig.config,
			collectionInstance: collectionInstance,
		},
		{
			meta: {
				collection_key: data.collection_key,
				user_id: data.user_id,
			},
			data: {
				document_id: document.id,
				bricks: bodyData.bricks,
				fields: bodyData.fields,
			},
		},
	);

	return document.id;
};

export default upsertSingle;
