import cdnSchema from "../../schemas/cdn.js";
import { swaggerResponse } from "../../utils/swagger/response-helpers.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import cdnServices from "../../services/cdn/index.js";

const streamSingleController: ControllerT<
	typeof cdnSchema.streamSingle.params,
	typeof cdnSchema.streamSingle.body,
	typeof cdnSchema.streamSingle.query
> = async (request, reply) => {
	const response = await serviceWrapper(cdnServices.streamMedia, false)(
		{
			db: request.server.db,
		},
		{
			key: request.params.key,
			query: request.query,
			accept: request.headers.accept,
		},
	);
	reply.status(204).send();
};

export default {
	controller: streamSingleController,
	zodSchema: cdnSchema.streamSingle,
	swaggerSchema: {
		description:
			"Stream a piece of media. If its an image, you can resize and format it on request. These will count towards the parent images processed image usage. This limit is configurable on a per project bases. Once it has been hit, instead of returning the processed image, it will return the original image. This is to prevent abuse of the endpoint.",
		tags: ["cdn"],
		summary: "Steam media",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
		querystring: {
			type: "object",
			properties: {
				width: {
					type: "string",
				},
				height: {
					type: "string",
				},
				format: {
					type: "string",
					enum: ["jpeg", "png", "webp", "avif"],
				},
				quality: {
					type: "string",
				},
				fallback: {
					type: "string",
					enum: ["1", "0"],
				},
			},
		},
	},
};
