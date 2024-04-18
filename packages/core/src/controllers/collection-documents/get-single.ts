import T from "../../translations/index.js";
import collectionDocumentsSchema from "../../schemas/collection-documents.js";
import {
	swaggerResponse,
	swaggerQueryString,
} from "../../utils/swagger-helpers.js";
import collectionDocumentsServices from "../../services/collection-documents/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import CollectionDocumentsFormatter from "../../libs/formatters/collection-documents.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";
import type { RouteController } from "../../types/types.js";

const getSingleController: RouteController<
	typeof collectionDocumentsSchema.getSingle.params,
	typeof collectionDocumentsSchema.getSingle.body,
	typeof collectionDocumentsSchema.getSingle.query
> = async (request, reply) => {
	try {
		const document = await serviceWrapper(
			collectionDocumentsServices.getSingle,
			false,
		)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				id: Number.parseInt(request.params.id),
				query: request.query,
			},
		);

		reply.status(200).send(
			await buildResponse(request, {
				data: document,
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
	controller: getSingleController,
	zodSchema: collectionDocumentsSchema.getSingle,
	swaggerSchema: {
		description: "Get a single collection document entry by ID.",
		tags: ["collection-documents"],
		summary: "Get a single collection document entry.",
		response: {
			200: swaggerResponse({
				type: 200,
				data: CollectionDocumentsFormatter.swagger,
			}),
		},
		querystring: swaggerQueryString({
			include: ["bricks"],
		}),
	},
};
