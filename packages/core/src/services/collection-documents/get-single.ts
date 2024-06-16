import T from "../../translations/index.js";
import collectionDocumentBricksServices from "../collection-document-bricks/index.js";
import collectionsServices from "../collections/index.js";
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
> = async (serviceConfig, data) => {
	const CollectionDocumentsRepo = Repository.get(
		"collection-documents",
		serviceConfig.db,
	);
	const CollectionDocumentsFormatter = Formatter.get("collection-documents");

	const document = await CollectionDocumentsRepo.selectSingleById({
		id: data.id,
		config: serviceConfig.config,
	});

	if (document === undefined || document.collection_key === null) {
		return {
			error: {
				type: "basic",
				name: T("error_not_found_name", {
					name: T("document"),
				}),
				message: T("error_not_found_message", {
					name: T("document"),
				}),
				status: 404,
			},
			data: undefined,
		};
	}

	const collectionRes = await collectionsServices.getSingleInstance(
		serviceConfig,
		{
			key: document.collection_key,
		},
	);
	if (collectionRes.error) return collectionRes;

	if (data.query.include?.includes("bricks")) {
		const bricksRes = await collectionDocumentBricksServices.getMultiple(
			serviceConfig,
			{
				documentId: data.id,
				collectionKey: document.collection_key,
			},
		);
		if (bricksRes.error) return bricksRes;

		return {
			error: undefined,
			data: CollectionDocumentsFormatter.formatSingle({
				document: document,
				collection: collectionRes.data,
				bricks: bricksRes.data.bricks,
				fields: bricksRes.data.fields,
				host: serviceConfig.config.host,
				localisation: {
					locales: serviceConfig.config.localisation.locales.map(
						(l) => l.code,
					),
					default: serviceConfig.config.localisation.defaultLocale,
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
			host: serviceConfig.config.host,
			localisation: {
				locales: serviceConfig.config.localisation.locales.map(
					(l) => l.code,
				),
				default: serviceConfig.config.localisation.defaultLocale,
			},
		}),
	};
};

export default getSingle;
