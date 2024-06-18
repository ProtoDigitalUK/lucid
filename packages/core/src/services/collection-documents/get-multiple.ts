import lucidServices from "../index.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type z from "zod";
import type collectionDocumentsSchema from "../../schemas/collection-documents.js";
import type { ServiceFn } from "../../libs/services/types.js";
import type { CollectionDocumentResponse } from "../../types/response.js";

const getMultiple: ServiceFn<
	[
		{
			collectionKey: string;
			query: z.infer<typeof collectionDocumentsSchema.getMultiple.query>;
		},
	],
	{
		data: CollectionDocumentResponse[];
		count: number;
	}
> = async (service, data) => {
	const collectionRes = await lucidServices.collection.getSingleInstance(
		service,
		{
			key: data.collectionKey,
		},
	);
	if (collectionRes.error) return collectionRes;

	const CollectionDocumentsRepo = Repository.get(
		"collection-documents",
		service.db,
	);
	const CollectionDocumentsFormatter = Formatter.get("collection-documents");

	const [documents, documentCount] =
		await CollectionDocumentsRepo.selectMultipleFiltered({
			query: data.query,
			collection: collectionRes.data,
			config: service.config,
		});

	return {
		error: undefined,
		data: {
			data: CollectionDocumentsFormatter.formatMultiple({
				documents: documents,
				collection: collectionRes.data,
				host: service.config.host,
				localisation: {
					locales: service.config.localisation.locales.map(
						(l) => l.code,
					),
					default: service.config.localisation.defaultLocale,
				},
			}),
			count: Formatter.parseCount(documentCount?.count),
		},
	};
};

export default getMultiple;
