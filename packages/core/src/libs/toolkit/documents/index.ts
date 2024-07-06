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
	getMultiple: async (
		...data: ExtractServiceFnArgs<
			typeof lucidServices.collection.document.client.getMultiple
		>
	) =>
		toolkitWrapper({
			fn: lucidServices.collection.document.client.getMultiple,
			data: data,
			config: {
				transaction: false,
				schema: z.object({
					collectionKey: z.string(),
					query: collectionDocumentsSchema.client.getMultiple.query,
				}),
				defaultError: {
					name: T("route_document_fetch_error_name"),
				},
			},
		}),
};

export default documentToolkit;
