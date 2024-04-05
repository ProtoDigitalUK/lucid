import T from "../../translations/index.js";
import type z from "zod";
import { APIError } from "../../utils/error-handler.js";
import type collectionDocumentsSchema from "../../schemas/collection-documents.js";
import collectionDocumentBricksServices from "../collection-document-bricks/index.js";
import collectionsServices from "../collections/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import formatCollectionDocument from "../../format/format-collection-document.js";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	id: number;
	query: z.infer<typeof collectionDocumentsSchema.getSingle.query>;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const CollectionDocumentsRepo = Repository.get(
		"collection-documents",
		serviceConfig.db,
	);

	const document = await CollectionDocumentsRepo.selectSingleById({
		id: data.id,
		config: serviceConfig.config,
	});

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
