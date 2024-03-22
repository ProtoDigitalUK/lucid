import cdnSchema from "../../schemas/cdn.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import cdnServices from "../../services/cdn/index.js";

const streamSingleController: ControllerT<
	typeof cdnSchema.streamSingle.params,
	typeof cdnSchema.streamSingle.body,
	typeof cdnSchema.streamSingle.query
> = async (request, reply) => {
	try {
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

		reply.header("Cache-Control", "public, max-age=31536000, immutable");
		reply.header(
			"Content-Disposition",
			`inline; filename="${response.key}"`,
		);
		if (response.contentLength)
			reply.header("Content-Length", response.contentLength);
		if (response.contentType)
			reply.header("Content-Type", response.contentType);

		return reply.send(response.body);
	} catch (error) {
		const { body, contentType } = await cdnServices.streamErrorImage({
			fallback: request.query?.fallback,
			error: error as Error,
		});

		reply.header("Content-Type", contentType);
		return reply.send(body);
	}
};

export default {
	controller: streamSingleController,
	zodSchema: cdnSchema.streamSingle,
	swaggerSchema: {
		description:
			"Stream a piece of media. If its an image, you can resize and format it on request. These will count towards the parent images processed image usage. This limit is configurable on a per project bases. Once it has been hit, instead of returning the processed image, it will return the original image. This is to prevent abuse of the endpoint.",
		tags: ["cdn"],
		summary: "Steam media",
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
