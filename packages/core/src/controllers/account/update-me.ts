import T from "../../translations/index.js";
import accountSchema from "../../schemas/account.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import account from "../../services/account/index.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import type { RouteController } from "../../types/types.js";

const updateMeController: RouteController<
	typeof accountSchema.updateMe.params,
	typeof accountSchema.updateMe.body,
	typeof accountSchema.updateMe.query
> = async (request, reply) => {
	const updateMe = await serviceWrapper(account.updateMe, {
		transaction: true,
		defaultError: {
			type: "basic",
			name: T("method_error_name", {
				name: T("user"),
				method: T("update"),
			}),
			message: T("update_error_message", {
				name: T("user").toLowerCase(),
			}),
			status: 500,
		},
	})(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			auth: request.auth,
			firstName: request.body.firstName,
			lastName: request.body.lastName,
			username: request.body.username,
			email: request.body.email,
			currentPassword: request.body.currentPassword,
			newPassword: request.body.newPassword,
			passwordConfirmation: request.body.passwordConfirmation,
		},
	);
	if (updateMe.error) throw new LucidAPIError(updateMe.error);

	reply.status(204).send();
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
				firstName: {
					type: "string",
				},
				lastName: {
					type: "string",
				},
				username: {
					type: "string",
				},
				email: {
					type: "string",
				},
				roleIds: {
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
