import T from "../../translations/index.js";
import mediaSchema from "../../schemas/media.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import processedImagesServices from "../../services/processed-images/index.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";

const clearSingleProcessedController: ControllerT<
	typeof mediaSchema.clearSingleProcessed.params,
	typeof mediaSchema.clearSingleProcessed.body,
	typeof mediaSchema.clearSingleProcessed.query
> = async (request, reply) => {
	try {
		await serviceWrapper(processedImagesServices.clearSingle, true)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				key: request.params.key,
			},
		);

		reply.status(204).send();
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				service: T("processed_images"),
				method: T("delete"),
			}),
			message: T("default_error_message"),
			status: 500,
		});
	}
};

export default {
	controller: clearSingleProcessedController,
	zodSchema: mediaSchema.clearSingleProcessed,
	swaggerSchema: {
		description:
			"Clear all processed images for a single media item based on the given key.",
		tags: ["media"],
		summary: "Clear all processed image for a single media item.",
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
