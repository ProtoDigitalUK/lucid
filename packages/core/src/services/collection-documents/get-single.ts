import T from "../../translations/index.js";
import type z from "zod";
import { LucidAPIError } from "../../utils/error-handler.js";
import type collectionDocumentsSchema from "../../schemas/collection-documents.js";
import collectionDocumentBricksServices from "../collection-document-bricks/index.js";
import collectionsServices from "../collections/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	id: number;
	query: z.infer<typeof collectionDocumentsSchema.getSingle.query>;
}

const getSingle = async (serviceConfig: ServiceConfig, data: ServiceData) => {
	const CollectionDocumentsRepo = Repository.get(
		"collection-documents",
		serviceConfig.db,
	);
	const LanguagesRepo = Repository.get("languages", serviceConfig.db);
	const CollectionDocumentsFormatter = Formatter.get("collection-documents");

	const document = await CollectionDocumentsRepo.selectSingleById({
		id: data.id,
		config: serviceConfig.config,
	});

	if (document === undefined || document.collection_key === null) {
		throw new LucidAPIError({
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

	const [collectionInstance, defaultLanguage] = await Promise.all([
		collectionsServices.getSingleInstance({
			key: document.collection_key,
		}),
		LanguagesRepo.selectSingle({
			select: ["id"],
			where: [
				{
					key: "is_default",
					operator: "=",
					value: 1,
				},
			],
		}),
	]);

	if (data.query.include?.includes("bricks")) {
		const bricksRes = await serviceWrapper(
			collectionDocumentBricksServices.getMultiple,
			false,
		)(serviceConfig, {
			documentId: data.id,
			collectionKey: document.collection_key,
		});

		return CollectionDocumentsFormatter.formatSingle({
			document: document,
			collection: collectionInstance,
			bricks: bricksRes.bricks,
			fields: bricksRes.fields,
			host: serviceConfig.config.host,
			defaultLanguageId: defaultLanguage?.id,
		});
	}

	return CollectionDocumentsFormatter.formatSingle({
		document: document,
		collection: collectionInstance,
		bricks: [],
		fields: [],
		host: serviceConfig.config.host,
		defaultLanguageId: defaultLanguage?.id,
	});
};

export default getSingle;
