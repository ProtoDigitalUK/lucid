import T from "../../../translations/index.js";
import z from "zod";
import toolkitWrapper from "../toolkit-wrapper.js";
import lucidServices from "../../../services/index.js";
import collectionDocumentsSchema from "../../../schemas/collection-documents.js";
import type { ExtractServiceFnArgs } from "../../../utils/services/types.js";

const documentToolkit = {
	getSingle: async (
		...data: ExtractServiceFnArgs<
			typeof lucidServices.collection.document.client.getSingle
		>
	) =>
		toolkitWrapper({
			fn: lucidServices.collection.document.client.getSingle,
			data: data,
			config: {
				transaction: false,
				schema: z.object({
					collectionKey: z.string(),
					query: collectionDocumentsSchema.client.getSingle.query,
				}),
				defaultError: {
					name: T("route_document_fetch_error_name"),
				},
			},
		}),
	// getMultiple: async (query: {
	// 	where: Partial<
	// 		Record<keyof HeadlessCollectionDocuments | string, FilterObject>
	// 	>;
	// 	sort: Array<{
	// 		key: string;
	// 		value: "asc" | "desc";
	// 	}>;
	// 	page: number;
	// 	perPage: number;
	// }) => {},
};

export default documentToolkit;
