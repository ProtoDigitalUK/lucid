import mediaSchema from "../../schemas/media.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import mediaServices from "../../services/media/index.js";
import buildResponse from "../../utils/app/build-response.js";
import { swaggerMediaRes } from "../../format/format-media.js";

const uploadSingleController: ControllerT<
	typeof mediaSchema.uploadSingle.params,
	typeof mediaSchema.uploadSingle.body,
	typeof mediaSchema.uploadSingle.query
> = async (request, reply) => {
	const mediaId = await serviceWrapper(mediaServices.uploadSingle, true)(
		{
			db: request.server.db,
		},
		{
			file_data: await request.file(),
			title_translations: request.body.title_translations,
			alt_translations: request.body.alt_translations,
			visible: true,
		},
	);
	const media = await serviceWrapper(mediaServices.getSingle, false)(
		{
			db: request.server.db,
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
				data: swaggerMediaRes,
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
						'Stringified JSON data containing tile_translations and alt_translations for the media.<br><br>Example: <code>{"title_translations":[{"language_id":1,"value":"title value"}],"alt_translations":[{"language_id":1,"value":"alt value"}]}</code>.<br><br>Translations dont have to be passed.',
				},
			},
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
