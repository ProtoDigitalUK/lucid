import mediaSchema from "../../schemas/media.js";
import { swaggerResponse } from "../../utils/swagger/response-helpers.js";
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
			fileData: await request.file(),
			translations: request.body.translations,
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
						'Stringified JSON data containing translations for the media. The translations should be an array of objects with the following properties: language_id, value, and key. The key should be either "title" or "alt".<br><br>Example: <code>{"translations":[{"language_id":1,"value":"Title value","key":"title"},{"language_id":1,"value":"Alt value","key":"alt"}]}</code>',
				},
			},
		},
	},
};
