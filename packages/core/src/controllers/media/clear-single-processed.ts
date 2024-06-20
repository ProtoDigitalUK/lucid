import T from "../../translations/index.js";
import mediaSchema from "../../schemas/media.js";
import { swaggerResponse, swaggerHeaders } from "../../utils/swagger/index.js";
import lucidServices from "../../services/index.js";
import serviceWrapper from "../../utils/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/errors/index.js";
import type { RouteController } from "../../types/types.js";

const clearSingleProcessedController: RouteController<
	typeof mediaSchema.clearSingleProcessed.params,
	typeof mediaSchema.clearSingleProcessed.body,
	typeof mediaSchema.clearSingleProcessed.query
> = async (request, reply) => {
	const clearProcessed = await serviceWrapper(
		lucidServices.processedImage.clearSingle,
		{
			transaction: true,
			defaultError: {
				type: "basic",
				name: T("route_media_clear_processed_error_name"),
				message: T("route_media_clear_processed_error_message"),
				status: 500,
			},
		},
	)(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			key: request.params.key,
		},
	);
	if (clearProcessed.error) throw new LucidAPIError(clearProcessed.error);

	reply.status(204).send();
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
