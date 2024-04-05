import type z from "zod";
import type collectionDocumentsSchema from "../../schemas/collection-documents.js";
import formatCollectionDocument from "../../format/format-collection-document.js";
import collectionsServices from "../collections/index.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";

export interface ServiceData {
	collection_key: string;
	query: z.infer<typeof collectionDocumentsSchema.getMultiple.query>;
	language_id: number;
}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const collectionInstance = await collectionsServices.getSingleInstance({
		key: data.collection_key,
	});

	const CollectionDocumentsRepo = Repository.get(
		"collection-documents",
		serviceConfig.db,
	);

	const [documents, documentCount] =
		await CollectionDocumentsRepo.selectMultipleFiltered({
			query: data.query,
			languageId: data.language_id,
			allowedFieldFilters: collectionInstance.data.config.fields.filter,
			allowedFieldIncludes: collectionInstance.data.config.fields.include,
			config: serviceConfig.config,
		});

	return {
		data: documents.map((doc) => {
			return formatCollectionDocument({
				document: doc,
				collection: collectionInstance,
				host: serviceConfig.config.host,
			});
		}),
		count: Formatter.parseCount(documentCount?.count),
	};
};

export default getMultiple;
