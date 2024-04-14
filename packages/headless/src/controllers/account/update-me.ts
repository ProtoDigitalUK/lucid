import T from "../../translations/index.js";
import accountSchema from "../../schemas/account.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import account from "../../services/account/index.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";

const updateMeController: ControllerT<
	typeof accountSchema.updateMe.params,
	typeof accountSchema.updateMe.body,
	typeof accountSchema.updateMe.query
> = async (request, reply) => {
	try {
		await serviceWrapper(account.updateMe, true)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				auth: request.auth,
				first_name: request.body.first_name,
				last_name: request.body.last_name,
				username: request.body.username,
				email: request.body.email,
				role_ids: request.body.role_ids,
			},
		);

		reply.status(204).send();
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				service: T("user"),
				method: T("update"),
			}),
			message: T("default_error_message"),
			status: 500,
		});
	}
};

export default {
	controller: updateMeController,
	zodSchema: accountSchema.updateMe,
	swaggerSchema: {
		description:
			"Used to update the current authenticated users information",
		tags: ["account"],
		summary: "Update the authenticated user",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
		body: {
			type: "object",
			properties: {
				first_name: {
					type: "string",
				},
				last_name: {
					type: "string",
				},
				username: {
					type: "string",
				},
				email: {
					type: "string",
				},
				role_ids: {
					type: "array",
					items: {
						type: "number",
					},
				},
			},
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
