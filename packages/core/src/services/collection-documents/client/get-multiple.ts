import Repository from "../../../libs/repositories/index.js";
import Formatter from "../../../libs/formatters/index.js";
import { splitDocumentFilters } from "../../../utils/helpers/index.js";
import type z from "zod";
import type collectionDocumentsSchema from "../../../schemas/collection-documents.js";
import type { ServiceFn } from "../../../utils/services/types.js";
import type { CollectionDocumentResponse } from "../../../types/response.js";

const getMultiple: ServiceFn<
	[
		{
			collectionKey: string;
			query: z.infer<
				typeof collectionDocumentsSchema.client.getMultiple.query
			>;
		},
	],
	{
		data: CollectionDocumentResponse[];
		count: number;
	}
> = async (context, data) => {
	const collectionRes = await context.services.collection.getSingleInstance(
		context,
		{
			key: data.collectionKey,
		},
	);
	if (collectionRes.error) return collectionRes;

	const CollectionDocumentsRepo = Repository.get(
		"collection-documents",
		context.db,
	);
	const CollectionDocumentsFormatter = Formatter.get("collection-documents");

	const { documentFilters, documentFieldFilters } = splitDocumentFilters(
		collectionRes.data,
		data.query.filter,
	);

	const [documents, documentCount] =
		await CollectionDocumentsRepo.selectMultipleFiltered({
			query: data.query,
			documentFilters,
			documentFieldFilters,
			includeAllFields: true,
			collection: collectionRes.data,
			config: context.config,
		});

	return {
		error: undefined,
		data: {
			data: CollectionDocumentsFormatter.formatMultiple({
				documents: documents,
				collection: collectionRes.data,
				host: context.config.host,
				localisation: {
					locales: context.config.localisation.locales.map(
						(l) => l.code,
					),
					default: context.config.localisation.defaultLocale,
				},
			}),
			count: Formatter.parseCount(documentCount?.count),
		},
	};
};

export default getMultiple;
