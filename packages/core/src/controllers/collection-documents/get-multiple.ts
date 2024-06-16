import T from "../../translations/index.js";
import collectionDocumentsSchema from "../../schemas/collection-documents.js";
import {
	swaggerResponse,
	swaggerQueryString,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import LucidServices from "../../services/index.js";
import buildResponse from "../../utils/build-response.js";
import CollectionDocumentsFormatter from "../../libs/formatters/collection-documents.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import type { RouteController } from "../../types/types.js";

const getMultipleController: RouteController<
	typeof collectionDocumentsSchema.getMultiple.params,
	typeof collectionDocumentsSchema.getMultiple.body,
	typeof collectionDocumentsSchema.getMultiple.query
> = async (request, reply) => {
	const documents = await serviceWrapper(
		LucidServices.collection.document.getMultiple,
		{
			transaction: false,
			defaultError: {
				type: "basic",
				name: T("route_document_fetch_error_name"),
				message: T("route_document_fetch_error_message"),
				status: 500,
			},
		},
	)(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			collectionKey: request.params.collectionKey,
			query: request.query,
		},
	);
	if (documents.error) throw new LucidAPIError(documents.error);

	reply.status(200).send(
		await buildResponse(request, {
			data: documents.data.data,
			pagination: {
				count: documents.data.count,
				page: request.query.page,
				perPage: request.query.perPage,
			},
		}),
	);
};

export default {
	controller: getMultipleController,
	zodSchema: collectionDocumentsSchema.getMultiple,
	swaggerSchema: {
		description: "Get a multiple collection document entries.",
		tags: ["collection-documents"],
		summary: "Get a multiple collection document entries.",
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "array",
					items: CollectionDocumentsFormatter.swagger,
				},
				paginated: true,
			}),
		},
		headers: swaggerHeaders({
			contentLocale: true,
		}),
		querystring: swaggerQueryString({
			filters: [],
			sorts: ["createdAt", "updatedAt"],
			page: true,
			perPage: true,
		}),
	},
};
