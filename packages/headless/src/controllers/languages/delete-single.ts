import languageSchema from "../../schemas/languages.js";
import { swaggerResponse } from "../../utils/swagger/response-helpers.js";
import languages from "../../services/languages/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

const deleteSingleController: ControllerT<
	typeof languageSchema.deleteSingle.params,
	typeof languageSchema.deleteSingle.body,
	typeof languageSchema.deleteSingle.query
> = async (request, reply) => {
	await serviceWrapper(languages.deleteSingle, true)(
		{
			db: request.server.db,
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
	},
};
