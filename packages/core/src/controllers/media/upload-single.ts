import T from "../../translations/index.js";
import mediaSchema from "../../schemas/media.js";
import { swaggerResponse, swaggerHeaders } from "../../utils/swagger/index.js";
import buildResponse from "../../utils/build-response.js";
import MediaFormatter from "../../libs/formatters/media.js";
import serviceWrapper from "../../utils/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/errors/index.js";
import type { RouteController } from "../../types/types.js";

const uploadSingleController: RouteController<
	typeof mediaSchema.uploadSingle.params,
	typeof mediaSchema.uploadSingle.body,
	typeof mediaSchema.uploadSingle.query
> = async (request, reply) => {
	const mediaId = await serviceWrapper(
		request.server.services.media.uploadSingle,
		{
			transaction: true,
			defaultError: {
				type: "basic",
				name: T("route_media_upload_error_name"),
				message: T("route_media_upload_error_message"),
				status: 500,
			},
		},
	)(
		{
			db: request.server.config.db.client,
			config: request.server.config,
			services: request.server.services,
		},
		{
			fileData: await request.file(),
			titleTranslations: request.body.titleTranslations,
			altTranslations: request.body.altTranslations,
			visible: 1,
		},
	);
	if (mediaId.error) throw new LucidAPIError(mediaId.error);

	const media = await serviceWrapper(
		request.server.services.media.getSingle,
		{
			transaction: false,
			defaultError: {
				type: "basic",
				name: T("route_media_fetch_error_name"),
				message: T("route_media_fetch_error_message"),
				status: 500,
			},
		},
	)(
		{
			db: request.server.config.db.client,
			config: request.server.config,
			services: request.server.services,
		},
		{
			id: mediaId.data,
		},
	);
	if (media.error) throw new LucidAPIError(media.error);

	reply.status(200).send(
		await buildResponse(request, {
			data: media.data,
		}),
	);
};

export default {
	controller: uploadSingleController,
	zodSchema: mediaSchema.uploadSingle,
	swaggerSchema: {
		description: "Upload a single file and set translations for it.",
		tags: ["media"],
		summary: "Upload a single file.",
		response: {
			200: swaggerResponse({
				type: 200,
				data: MediaFormatter.swagger,
			}),
		},
		consumes: ["multipart/form-data"],
		body: {
			type: "object",
			properties: {
				file: {
					type: "string",
					format: "binary",
				},
			},
		},
		querystring: {
			type: "object",
			required: ["body"],
			properties: {
				body: {
					type: "string",
					description:
						'Stringified JSON data containing tileTranslations and altTranslations for the media.<br><br>Example: <code>{"titleTranslations":[{"localeCode":"en","value":"title value"}],"altTranslations":[{"localeCode":"en","value":"alt value"}]}</code>.<br><br>Translations dont have to be passed.',
				},
			},
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
