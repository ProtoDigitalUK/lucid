import T from "../../translations/index.js";
import collectionsSchema from "../../schemas/collections.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import collectionsServices from "../../services/collections/index.js";
import buildResponse from "../../utils/build-response.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import CollectionsFormatter from "../../libs/formatters/collections.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";
import type { RouteController } from "../../types/types.js";

const getSingleController: RouteController<
	typeof collectionsSchema.getSingle.params,
	typeof collectionsSchema.getSingle.body,
	typeof collectionsSchema.getSingle.query
> = async (request, reply) => {
	try {
		const collection = await serviceWrapper(
			collectionsServices.getSingle,
			false,
		)(
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

		reply.status(200).send(
			await buildResponse(request, {
				data: collection,
			}),
		);
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				name: T("collection"),
				method: T("fetch"),
			}),
			message: T("default_error_message"),
			status: 500,
		});
	}
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
