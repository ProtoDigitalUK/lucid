import T from "../../translations/index.js";
import mediaSchema from "../../schemas/media.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import mediaServices from "../../services/media/index.js";
import buildResponse from "../../utils/build-response.js";
import MediaFormatter from "../../libs/formatters/media.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";

const uploadSingleController: ControllerT<
	typeof mediaSchema.uploadSingle.params,
	typeof mediaSchema.uploadSingle.body,
	typeof mediaSchema.uploadSingle.query
> = async (request, reply) => {
	try {
		const mediaId = await serviceWrapper(mediaServices.uploadSingle, true)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				fileData: await request.file(),
				titleTranslations: request.body.titleTranslations,
				altTranslations: request.body.altTranslations,
				visible: 1,
			},
		);
		const media = await serviceWrapper(mediaServices.getSingle, false)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				id: mediaId,
			},
		);

		reply.status(200).send(
			await buildResponse(request, {
				data: media,
			}),
		);
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				name: T("media"),
				method: T("create"),
			}),
			message: T("creation_error_message", {
				name: T("media").toLowerCase(),
			}),
			status: 500,
		});
	}
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
						'Stringified JSON data containing tileTranslations and altTranslations for the media.<br><br>Example: <code>{"titleTranslations":[{"languageId":1,"value":"title value"}],"altTranslations":[{"languageId":1,"value":"alt value"}]}</code>.<br><br>Translations dont have to be passed.',
				},
			},
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
