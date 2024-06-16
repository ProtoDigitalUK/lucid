import T from "../../translations/index.js";
import collectionsSchema from "../../schemas/collections.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import LucidServices from "../../services/index.js";
import buildResponse from "../../utils/build-response.js";
import CollectionsFormatter from "../../libs/formatters/collections.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import type { RouteController } from "../../types/types.js";

const getAllController: RouteController<
	typeof collectionsSchema.getAll.params,
	typeof collectionsSchema.getAll.body,
	typeof collectionsSchema.getAll.query
> = async (request, reply) => {
	const collections = await serviceWrapper(LucidServices.collection.getAll, {
		transaction: false,
		defaultError: {
			type: "basic",
			name: T("method_error_name", {
				name: T("collection"),
				method: T("fetch"),
			}),
			message: T("default_error_message"),
			status: 500,
		},
	})(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			includeDocumentId: true,
		},
	);
	if (collections.error) throw new LucidAPIError(collections.error);

	reply.status(200).send(
		await buildResponse(request, {
			data: collections.data,
		}),
	);
};

export default {
	controller: getAllController,
	zodSchema: collectionsSchema.getAll,
	swaggerSchema: {
		description: "Get all collection instances.",
		tags: ["collections"],
		summary: "Get all collections",
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "array",
					items: CollectionsFormatter.swagger,
				},
			}),
		},
	},
};
