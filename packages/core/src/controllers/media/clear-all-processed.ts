import T from "../../translations/index.js";
import mediaSchema from "../../schemas/media.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import LucidServices from "../../services/index.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import type { RouteController } from "../../types/types.js";

const clearAllProcessedController: RouteController<
	typeof mediaSchema.clearAllProcessed.params,
	typeof mediaSchema.clearAllProcessed.body,
	typeof mediaSchema.clearAllProcessed.query
> = async (request, reply) => {
	const clearProcessed = await serviceWrapper(
		LucidServices.processedImage.clearAll,
		{
			transaction: true,
			defaultError: {
				type: "basic",
				name: T("route_media_clear_processed_error_name"),
				message: T("route_media_clear_processed_error_message"),
				status: 500,
			},
		},
	)({
		db: request.server.config.db.client,
		config: request.server.config,
	});
	if (clearProcessed.error) throw new LucidAPIError(clearProcessed.error);

	reply.status(204).send();
};

export default {
	controller: clearAllProcessedController,
	zodSchema: mediaSchema.clearAllProcessed,
	swaggerSchema: {
		description: "Clear all processed images for a every media item.",
		tags: ["media"],
		summary: "Clear all processed images.",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
