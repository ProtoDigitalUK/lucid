import T from "../../translations/index.js";
import collectionDocumentsSchema from "../../schemas/collection-documents.js";
import {
	swaggerResponse,
	swaggerQueryString,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import collectionDocumentsServices from "../../services/collection-documents/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import CollectionDocumentsFormatter from "../../libs/formatters/collection-documents.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";
import type { RouteController } from "../../types/types.js";

const getMultipleController: RouteController<
	typeof collectionDocumentsSchema.getMultiple.params,
	typeof collectionDocumentsSchema.getMultiple.body,
	typeof collectionDocumentsSchema.getMultiple.query
> = async (request, reply) => {
	try {
		const documents = await serviceWrapper(
			collectionDocumentsServices.getMultiple,
			false,
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

		reply.status(200).send(
			await buildResponse(request, {
				data: documents.data,
				pagination: {
					count: documents.count,
					page: request.query.page,
					perPage: request.query.perPage,
				},
			}),
		);
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				name: T("document"),
				method: T("fetch"),
			}),
			message: T("default_error_message"),
			status: 500,
		});
	}
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
