import T from "../../translations/index.js";
import type z from "zod";
import { APIError } from "../../utils/error-handler.js";
import type collectionDocumentsSchema from "../../schemas/collection-documents.js";
import collectionDocumentBricksServices from "../collection-document-bricks/index.js";
import collectionsServices from "../collections/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import formatCollectionDocument from "../../format/format-collection-document.js";

export interface ServiceData {
	id: number;
	query: z.infer<typeof collectionDocumentsSchema.getSingle.query>;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const document = await serviceConfig.db
		.selectFrom("headless_collection_documents")
		.select([
			"headless_collection_documents.id",
			"headless_collection_documents.collection_key",
			"headless_collection_documents.created_by",
			"headless_collection_documents.created_at",
			"headless_collection_documents.updated_at",
		])
		.innerJoin(
			"headless_users",
			"headless_users.id",
			"headless_collection_documents.created_by",
		)
		.select([
			"headless_users.id as author_id",
			"headless_users.email as author_email",
			"headless_users.first_name as author_first_name",
			"headless_users.last_name as author_last_name",
			"headless_users.username as author_username",
		])
		.where("headless_collection_documents.id", "=", data.id)
		.where("headless_collection_documents.is_deleted", "=", 0)
		.executeTakeFirst();

	if (document === undefined || document.collection_key === null) {
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

	const collectionInstance = await collectionsServices.getSingleInstance({
		key: document.collection_key,
	});

	if (data.query.include?.includes("bricks")) {
		const bricksRes = await serviceWrapper(
			collectionDocumentBricksServices.getMultiple,
			false,
		)(serviceConfig, {
			document_id: data.id,
			collection_key: document.collection_key,
		});
		return formatCollectionDocument({
			document: document,
			collection: collectionInstance,
			bricks: bricksRes.bricks,
			fields: bricksRes.fields,
			host: serviceConfig.config.host,
		});
	}

	return formatCollectionDocument({
		document: document,
		collection: collectionInstance,
		bricks: [],
		fields: [],
		host: serviceConfig.config.host,
	});
};

export default getSingle;
