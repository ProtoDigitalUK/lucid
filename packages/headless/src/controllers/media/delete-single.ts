import mediaSchema from "../../schemas/media.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import mediaServices from "../../services/media/index.js";

const deleteSingleController: ControllerT<
	typeof mediaSchema.deleteSingle.params,
	typeof mediaSchema.deleteSingle.body,
	typeof mediaSchema.deleteSingle.query
> = async (request, reply) => {
	await serviceWrapper(mediaServices.deleteSingle, true)(
		{
			config: request.server.config,
		},
		{
			id: Number.parseInt(request.params.id),
		},
	);

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
