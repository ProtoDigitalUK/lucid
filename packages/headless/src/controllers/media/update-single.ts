import mediaSchema from "../../schemas/media.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import mediaServices from "../../services/media/index.js";

const updateSingleController: ControllerT<
	typeof mediaSchema.updateSingle.params,
	typeof mediaSchema.updateSingle.body,
	typeof mediaSchema.updateSingle.query
> = async (request, reply) => {
	await serviceWrapper(mediaServices.updateSingle, true)(
		{
			db: request.server.db,
		},
		{
			id: parseInt(request.params.id),
			fileData: await request.file(),
			translations: request.body.translations,
		},
	);

	reply.status(204).send();
};

export default {
	controller: updateSingleController,
	zodSchema: mediaSchema.updateSingle,
	swaggerSchema: {
		description:
			"Update a single media entry with translations and new upload.",
		tags: ["media"],
		summary: "Update a single media entry.",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
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
						'Stringified JSON data containing translations for the media. The translations should be an array of objects with the following properties: language_id, value, and key. The key should be either "title" or "alt".<br><br>Example: <code>{"translations":[{"language_id":1,"value":"Title value","key":"title"},{"language_id":1,"value":"Alt value","key":"alt"}]}</code>.<br><br>Translations dont have to be passed.',
				},
			},
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
