import T from "../../translations/index.js";
import collectionsSchema from "../../schemas/collections.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import collectionsServices from "../../services/collections/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import CollectionsFormatter from "../../libs/formatters/collections.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";

const getAllController: ControllerT<
	typeof collectionsSchema.getAll.params,
	typeof collectionsSchema.getAll.body,
	typeof collectionsSchema.getAll.query
> = async (request, reply) => {
	try {
		const collections = await serviceWrapper(
			collectionsServices.getAll,
			false,
		)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				includeDocumentId: true,
			},
		);

		reply.status(200).send(
			await buildResponse(request, {
				data: collections,
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
