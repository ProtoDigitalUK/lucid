import T from "../../translations/index.js";
import accountSchema from "../../schemas/account.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import lucidServices from "../../services/index.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import type { RouteController } from "../../types/types.js";

const resetPasswordController: RouteController<
	typeof accountSchema.resetPassword.params,
	typeof accountSchema.resetPassword.body,
	typeof accountSchema.resetPassword.query
> = async (request, reply) => {
	const resetPassword = await serviceWrapper(
		lucidServices.account.resetPassword,
		{
			transaction: true,
			defaultError: {
				type: "basic",
				name: T("route_reset_password_error_name"),
				message: T("route_reset_password_error_message"),
				status: 500,
			},
		},
	)(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			token: request.params.token,
			password: request.body.password,
		},
	);
	if (resetPassword.error) throw new LucidAPIError(resetPassword.error);

	reply.status(204).send();
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
