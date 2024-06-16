import T from "../../translations/index.js";
import collectionDocumentsSchema from "../../schemas/collection-documents.js";
import {
	swaggerResponse,
	swaggerQueryString,
} from "../../utils/swagger-helpers.js";
import LucidServices from "../../services/index.js";
import buildResponse from "../../utils/build-response.js";
import CollectionDocumentsFormatter from "../../libs/formatters/collection-documents.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import type { RouteController } from "../../types/types.js";

const getSingleController: RouteController<
	typeof collectionDocumentsSchema.getSingle.params,
	typeof collectionDocumentsSchema.getSingle.body,
	typeof collectionDocumentsSchema.getSingle.query
> = async (request, reply) => {
	const document = await serviceWrapper(
		LucidServices.collection.document.getSingle,
		{
			transaction: false,
			defaultError: {
				type: "basic",
				name: T("method_error_name", {
					name: T("document"),
					method: T("fetch"),
				}),
				message: T("default_error_message"),
				status: 500,
			},
		},
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
	if (document.error) throw new LucidAPIError(document.error);

	reply.status(200).send(
		await buildResponse(request, {
			data: document.data,
		}),
	);
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
