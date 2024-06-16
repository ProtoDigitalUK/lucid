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

const deleteSingleController: RouteController<
	typeof mediaSchema.deleteSingle.params,
	typeof mediaSchema.deleteSingle.body,
	typeof mediaSchema.deleteSingle.query
> = async (request, reply) => {
	const deleteSingel = await serviceWrapper(
		LucidServices.media.deleteSingle,
		{
			transaction: true,
			defaultError: {
				type: "basic",
				name: T("route_media_delete_error_name"),
				message: T("route_media_delete_error_message"),
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
		},
	);
	if (deleteSingel.error) throw new LucidAPIError(deleteSingel.error);

	reply.status(204).send();
};

export default {
	controller: deleteSingleController,
	zodSchema: mediaSchema.deleteSingle,
	swaggerSchema: {
		description:
			"Delete a single media item by id and clear its processed images if media is an image.",
		tags: ["media"],
		summary: "Delete a single media item.",
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
