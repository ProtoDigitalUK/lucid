import T from "../../translations/index.js";
import LucidServices from "../index.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type z from "zod";
import type { ServiceFn } from "../../libs/services/types.js";
import type collectionDocumentsSchema from "../../schemas/collection-documents.js";
import type { CollectionDocumentResponse } from "../../types/response.js";

const getSingle: ServiceFn<
	[
		{
			id: number;
			query: z.infer<typeof collectionDocumentsSchema.getSingle.query>;
		},
	],
	CollectionDocumentResponse
> = async (service, data) => {
	const CollectionDocumentsRepo = Repository.get(
		"collection-documents",
		service.db,
	);
	const CollectionDocumentsFormatter = Formatter.get("collection-documents");

	const document = await CollectionDocumentsRepo.selectSingleById({
		id: data.id,
		config: service.config,
	});

	if (document === undefined || document.collection_key === null) {
		return {
			error: {
				type: "basic",
				message: T("document_not_found_message"),
				status: 404,
			},
			data: undefined,
		};
	}

	const collectionRes = await LucidServices.collection.getSingleInstance(
		service,
		{
			key: document.collection_key,
		},
	);
	if (collectionRes.error) return collectionRes;

	if (data.query.include?.includes("bricks")) {
		const bricksRes =
			await LucidServices.collection.document.brick.getMultiple(service, {
				documentId: data.id,
				collectionKey: document.collection_key,
			});
		if (bricksRes.error) return bricksRes;

		return {
			error: undefined,
			data: CollectionDocumentsFormatter.formatSingle({
				document: document,
				collection: collectionRes.data,
				bricks: bricksRes.data.bricks,
				fields: bricksRes.data.fields,
				host: service.config.host,
				localisation: {
					locales: service.config.localisation.locales.map(
						(l) => l.code,
					),
					default: service.config.localisation.defaultLocale,
				},
			}),
		};
	}

	return {
		error: undefined,
		data: CollectionDocumentsFormatter.formatSingle({
			document: document,
			collection: collectionRes.data,
			bricks: [],
			fields: [],
			host: service.config.host,
			localisation: {
				locales: service.config.localisation.locales.map((l) => l.code),
				default: service.config.localisation.defaultLocale,
			},
		}),
	};
};

export default getSingle;
