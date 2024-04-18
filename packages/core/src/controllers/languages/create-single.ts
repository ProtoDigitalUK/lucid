import T from "../../translations/index.js";
import languageSchema from "../../schemas/languages.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import languages from "../../services/languages/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import LanguagesFormatter from "../../libs/formatters/languages.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";
import type { RouteController } from "../../types/types.js";

const createSingleController: RouteController<
	typeof languageSchema.createSingle.params,
	typeof languageSchema.createSingle.body,
	typeof languageSchema.createSingle.query
> = async (request, reply) => {
	try {
		const languageCode = await serviceWrapper(languages.createSingle, true)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				code: request.body.code,
				isEnabled: request.body.isEnabled,
				isDefault: request.body.isDefault,
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
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				name: T("language"),
				method: T("create"),
			}),
			message: T("creation_error_message", {
				name: T("language").toLowerCase(),
			}),
			status: 500,
		});
	}
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
				isEnabled: {
					type: "number",
				},
				isDefault: {
					type: "number",
				},
			},
			required: ["code", "isEnabled", "isDefault"],
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
