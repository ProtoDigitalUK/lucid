import T from "../../translations/index.js";
import mediaSchema from "../../schemas/media.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import mediaServices from "../../services/media/index.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";

const deleteSingleController: ControllerT<
	typeof mediaSchema.deleteSingle.params,
	typeof mediaSchema.deleteSingle.body,
	typeof mediaSchema.deleteSingle.query
> = async (request, reply) => {
	try {
		await serviceWrapper(mediaServices.deleteSingle, true)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				id: Number.parseInt(request.params.id),
			},
		);

		reply.status(204).send();
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				service: T("media"),
				method: T("delete"),
			}),
			message: T("default_error_message"),
			status: 500,
		});
	}
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
