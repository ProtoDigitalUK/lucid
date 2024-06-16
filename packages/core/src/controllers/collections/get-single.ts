import T from "../../translations/index.js";
import collectionsSchema from "../../schemas/collections.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import collectionsServices from "../../services/collections/index.js";
import buildResponse from "../../utils/build-response.js";
import CollectionsFormatter from "../../libs/formatters/collections.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import type { RouteController } from "../../types/types.js";

const getSingleController: RouteController<
	typeof collectionsSchema.getSingle.params,
	typeof collectionsSchema.getSingle.body,
	typeof collectionsSchema.getSingle.query
> = async (request, reply) => {
	const collection = await serviceWrapper(collectionsServices.getSingle, {
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
			key: request.params.key,
			include: {
				bricks: true,
				fields: true,
				documentId: true,
			},
		},
	);
	if (collection.error) throw new LucidAPIError(collection.error);

	reply.status(200).send(
		await buildResponse(request, {
			data: collection.data,
		}),
	);
};

export default {
	controller: getSingleController,
	zodSchema: collectionsSchema.getSingle,
	swaggerSchema: {
		description: "Get a single collection instance.",
		tags: ["collections"],
		summary: "Get a collection",
		response: {
			200: swaggerResponse({
				type: 200,
				data: CollectionsFormatter.swagger,
			}),
		},
	},
};
