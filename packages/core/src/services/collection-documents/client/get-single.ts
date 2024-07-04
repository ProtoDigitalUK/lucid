import T from "../../../translations/index.js";
import Repository from "../../../libs/repositories/index.js";
import Formatter from "../../../libs/formatters/index.js";
import { splitDocumentFilters } from "../../../utils/helpers/index.js";
import type z from "zod";
import type { ServiceFn } from "../../../utils/services/types.js";
import type collectionDocumentsSchema from "../../../schemas/collection-documents.js";
import type { CollectionDocumentResponse } from "../../../types/response.js";

const getSingle: ServiceFn<
	[
		{
			collectionKey: string;
			query: z.infer<
				typeof collectionDocumentsSchema.client.getSingle.query
			>;
		},
	],
	CollectionDocumentResponse
> = async (context, data) => {
	const CollectionDocumentsRepo = Repository.get(
		"collection-documents",
		context.db,
	);
	const CollectionDocumentsFormatter = Formatter.get("collection-documents");

	// split filters into two groups, one for the document based on a fixed set of keys, and allowed filters set against the collection
	// should lookup a single document by a given filter and or field value
	// then fetch all bricks and collection fields for that document
	// return nested response

	const collectionRes = await context.services.collection.getSingleInstance(
		context,
		{
			key: data.collectionKey,
		},
	);
	if (collectionRes.error) return collectionRes;

	const { documentFilters, fieldFilters } = splitDocumentFilters(
		collectionRes.data,
		data.query.filter,
	);

	const pageRes = await CollectionDocumentsRepo.selectSingleFitlered({
		documentFilters: documentFilters,
		fieldFilters: fieldFilters,
		collection: collectionRes.data,
		config: context.config,
	});
	if (pageRes === undefined) {
		return {
			error: {
				type: "basic",
				message: T("route_document_fetch_error_message"),
				status: 404,
			},
			data: undefined,
		};
	}

	return {
		error: undefined,
		data: CollectionDocumentsFormatter.formatSingle({
			document: pageRes,
			collection: collectionRes.data,
			host: context.config.host,
			localisation: {
				locales: context.config.localisation.locales.map((l) => l.code),
				default: context.config.localisation.defaultLocale,
			},
		}),
	};
};

export default getSingle;
