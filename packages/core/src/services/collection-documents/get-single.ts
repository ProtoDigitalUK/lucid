import T from "../../translations/index.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type z from "zod";
import type { ServiceFn } from "../../utils/services/types.js";
import type collectionDocumentsSchema from "../../schemas/collection-documents.js";
import type { CollectionDocumentResponse } from "../../types/response.js";

const getSingle: ServiceFn<
	[
		{
			id: number;
			collectionKey: string;
			query: z.infer<typeof collectionDocumentsSchema.getSingle.query>;
		},
	],
	CollectionDocumentResponse
> = async (context, data) => {
	const CollectionDocumentsRepo = Repository.get(
		"collection-documents",
		context.db,
	);
	const CollectionDocumentsFormatter = Formatter.get("collection-documents");

	const [document, collectionRes] = await Promise.all([
		CollectionDocumentsRepo.selectSingleById({
			id: data.id,
			collectionKey: data.collectionKey,
			config: context.config,
		}),
		context.services.collection.getSingleInstance(context, {
			key: data.collectionKey,
		}),
	]);
	if (document === undefined) {
		return {
			error: {
				type: "basic",
				message: T("document_not_found_message"),
				status: 404,
			},
			data: undefined,
		};
	}
	if (collectionRes.error) return collectionRes;

	if (data.query.include?.includes("bricks")) {
		const bricksRes =
			await context.services.collection.document.brick.getMultiple(
				context,
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
				config: context.config,
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
			config: context.config,
		}),
	};
};

export default getSingle;
