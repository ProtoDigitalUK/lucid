import languageSchema from "../../schemas/languages.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import languages from "../../services/languages/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";

const deleteSingleController: ControllerT<
	typeof languageSchema.deleteSingle.params,
	typeof languageSchema.deleteSingle.body,
	typeof languageSchema.deleteSingle.query
> = async (request, reply) => {
	await serviceWrapper(languages.deleteSingle, true)(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			code: request.params.code,
		},
	);

	reply.status(204).send();
};

export default {
	controller: deleteSingleController,
	zodSchema: languageSchema.deleteSingle,
	swaggerSchema: {
		description: "Delete a single language based on the given code.",
		tags: ["languages"],
		summary: "Delete a single code",
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
