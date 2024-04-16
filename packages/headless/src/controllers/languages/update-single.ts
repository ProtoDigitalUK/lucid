import T from "../../translations/index.js";
import languageSchema from "../../schemas/languages.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import languages from "../../services/languages/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";
import type { RouteController } from "../../types/types.js";

const updateSingleController: RouteController<
	typeof languageSchema.updateSingle.params,
	typeof languageSchema.updateSingle.body,
	typeof languageSchema.updateSingle.query
> = async (request, reply) => {
	try {
		await serviceWrapper(languages.updateSingle, true)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				currentCode: request.params.code,
				code: request.body.code,
				isDefault: request.body.isDefault,
				isEnabled: request.body.isEnabled,
			},
		);

		reply.status(204).send();
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				name: T("language"),
				method: T("update"),
			}),
			message: T("update_error_message", {
				name: T("language").toLowerCase(),
			}),
			status: 500,
		});
	}
};

export default {
	controller: updateSingleController,
	zodSchema: languageSchema.updateSingle,
	swaggerSchema: {
		description: "Update a single language with the given data.",
		tags: ["languages"],
		summary: "Update a single language",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
		body: {
			type: "object",
			properties: {
				code: {
					type: "string",
				},
				isDefault: {
					type: "number",
				},
				isEnabled: {
					type: "number",
				},
			},
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
