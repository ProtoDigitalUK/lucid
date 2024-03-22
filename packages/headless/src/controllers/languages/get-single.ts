import languageSchema from "../../schemas/languages.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import languages from "../../services/languages/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import { swaggerLanguageRes } from "../../format/format-language.js";

const getSingleController: ControllerT<
	typeof languageSchema.getSingle.params,
	typeof languageSchema.getSingle.body,
	typeof languageSchema.getSingle.query
> = async (request, reply) => {
	const languageRes = await serviceWrapper(languages.getSingle, false)(
		{
			db: request.server.db,
		},
		{
			code: request.params.code,
		},
	);

	reply.status(200).send(
		await buildResponse(request, {
			data: languageRes,
		}),
	);
};

export default {
	controller: getSingleController,
	zodSchema: languageSchema.getSingle,
	swaggerSchema: {
		description:
			"Returns a single language based on the code URL parameter.",
		tags: ["languages"],
		summary: "Get a single language",
		response: {
			200: swaggerResponse({
				type: 200,
				data: swaggerLanguageRes,
			}),
		},
	},
};
