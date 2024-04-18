import T from "../../translations/index.js";
import accountSchema from "../../schemas/account.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import account from "../../services/account/index.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";
import type { RouteController } from "../../types/types.js";

const resetPasswordController: RouteController<
	typeof accountSchema.resetPassword.params,
	typeof accountSchema.resetPassword.body,
	typeof accountSchema.resetPassword.query
> = async (request, reply) => {
	try {
		await serviceWrapper(account.resetPassword, true)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				token: request.params.token,
				password: request.body.password,
			},
		);

		reply.status(204).send();
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("default_error_name"),
			message: T("default_error_message"),
			status: 500,
		});
	}
};

export default {
	controller: resetPasswordController,
	zodSchema: accountSchema.resetPassword,
	swaggerSchema: {
		description: "Resets the password for the user if the token is valid",
		tags: ["account"],
		summary: "Resets users password",
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
