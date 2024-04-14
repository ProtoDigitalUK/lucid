import T from "../../translations/index.js";
import mediaSchema from "../../schemas/media.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import processedImagesServices from "../../services/processed-images/index.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";

const clearAllProcessedController: ControllerT<
	typeof mediaSchema.clearAllProcessed.params,
	typeof mediaSchema.clearAllProcessed.body,
	typeof mediaSchema.clearAllProcessed.query
> = async (request, reply) => {
	try {
		await serviceWrapper(
			processedImagesServices.clearAll,
			true,
		)({
			db: request.server.config.db.client,
			config: request.server.config,
		});

		reply.status(204).send();
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				name: T("processed_images"),
				method: T("delete"),
			}),
			message: T("deletion_error_message", {
				name: T("processed_images").toLowerCase(),
			}),
			status: 500,
		});
	}
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
