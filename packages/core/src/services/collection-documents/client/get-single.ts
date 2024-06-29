import T from "../../../translations/index.js";
import Repository from "../../../libs/repositories/index.js";
import Formatter from "../../../libs/formatters/index.js";
import type z from "zod";
import type { ServiceFn } from "../../../utils/services/types.js";
import type collectionDocumentsSchema from "../../../schemas/collection-documents.js";

const getSingle: ServiceFn<
	[
		{
			collectionKey: string;
			query: z.infer<
				typeof collectionDocumentsSchema.client.getSingle.query
			>;
		},
	],
	undefined
> = async (context, data) => {
	const CollectionDocumentsRepo = Repository.get(
		"collection-documents",
		context.db,
	);
	const CollectionDocumentsFormatter = Formatter.get("collection-documents");

	console.log(data);

	// split filters into two groups, one for the document based on a fixed set of keys, and allowed filters set against the collection
	// should lookup a single document by a given filter and or field value
	// then fetch all bricks and collection fields for that document
	// return nested response

	return {
		error: undefined,
		data: undefined,
	};
};

export default getSingle;
