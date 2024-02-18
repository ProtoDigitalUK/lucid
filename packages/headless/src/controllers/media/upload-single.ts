import mediaSchema from "../../schemas/media.js";
import { swaggerResponse } from "../../utils/swagger/response-helpers.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import buildResponse from "../../utils/app/build-response.js";

const uploadSingleController: ControllerT<
	typeof mediaSchema.uploadSingle.params,
	typeof mediaSchema.uploadSingle.body,
	typeof mediaSchema.uploadSingle.query
> = async (request, reply) => {
	console.log("body-data", request.body);

	reply.status(204).send();
	// reply.status(200).send(
	// 	await buildResponse(request, {
	// 		data: undefined,
	// 	}),
	// );
};

export default {
	controller: uploadSingleController,
	zodSchema: mediaSchema.uploadSingle,
	swaggerSchema: {
		description: "Upload a single file and set translations for it.",
		tags: ["media"],
		summary: "Upload a single file.",
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
				body: {
					type: "string",
					description:
						'Stringified JSON data ie: {"translations":[{"language_id":1,"title":"Title","alt":"Alt"}]}',
				},
			},
		},
	},
};
