import languageSchema from "../../schemas/languages.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import languages from "../../services/languages/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import LanguagesFormatter from "../../libs/formatters/languages.js";

const createSingleController: ControllerT<
	typeof languageSchema.createSingle.params,
	typeof languageSchema.createSingle.body,
	typeof languageSchema.createSingle.query
> = async (request, reply) => {
	const languageCode = await serviceWrapper(languages.createSingle, true)(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			code: request.body.code,
			is_enabled: request.body.is_enabled,
			is_default: request.body.is_default,
		},
	);

	const language = await serviceWrapper(languages.getSingle, false)(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			code: languageCode,
		},
	);

	reply.status(200).send(
		await buildResponse(request, {
			data: language,
		}),
	);
};

export default {
	controller: createSingleController,
	zodSchema: languageSchema.createSingle,
	swaggerSchema: {
		description:
			"Creates a new language. Languages are used to translate content and to provide a different experience for different users based on their language.",
		tags: ["languages"],
		summary: "Create a language",
		body: {
			type: "object",
			properties: {
				code: {
					type: "string",
				},
				is_enabled: {
					type: "number",
				},
				is_default: {
					type: "number",
				},
			},
			required: ["code", "is_enabled", "is_default"],
		},
		response: {
			200: swaggerResponse({
				type: 200,
				data: LanguagesFormatter.swagger,
			}),
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
