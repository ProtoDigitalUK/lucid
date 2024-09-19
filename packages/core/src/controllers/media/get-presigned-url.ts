import T from "../../translations/index.js";
import mediaSchema from "../../schemas/media.js";
import { swaggerResponse } from "../../utils/swagger/index.js";
import formatAPIResponse from "../../utils/build-response.js";
import MediaFormatter from "../../libs/formatters/media.js";
import serviceWrapper from "../../utils/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/errors/index.js";
import type { RouteController } from "../../types/types.js";

const getPresignedUrlController: RouteController<
	typeof mediaSchema.getPresignedUrl.params,
	typeof mediaSchema.getPresignedUrl.body,
	typeof mediaSchema.getPresignedUrl.query
> = async (request, reply) => {
	const media = await serviceWrapper(
		request.server.services.media.getPresignedUrl,
		{
			transaction: false,
			defaultError: {
				type: "basic",
				name: T("route_media_fetch_error_name"),
				message: T("route_media_fetch_error_message"),
			},
		},
	)(
		{
			db: request.server.config.db.client,
			config: request.server.config,
			services: request.server.services,
		},
		{
			fileName: request.body.fileName,
			mimeType: request.body.mimeType,
			width: request.body.width,
			height: request.body.height,
		},
	);
	if (media.error) throw new LucidAPIError(media.error);

	reply.status(200).send(
		formatAPIResponse(request, {
			data: media.data,
		}),
	);
};

export default {
	controller: getPresignedUrlController,
	zodSchema: mediaSchema.getPresignedUrl,
	swaggerSchema: {
		description: "Get a presigned URL to upload a single media item.",
		tags: ["media"],
		summary: "Get a presigned URL to upload a single media item.",
		response: {
			200: swaggerResponse({
				type: 200,
				data: MediaFormatter.presignedUrlSwagger,
			}),
		},
	},
};
