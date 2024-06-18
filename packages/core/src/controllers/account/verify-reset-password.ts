import T from "../../translations/index.js";
import accountSchema from "../../schemas/account.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import lucidServices from "../../services/index.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import type { RouteController } from "../../types/types.js";

const verifyResetPasswordController: RouteController<
	typeof accountSchema.verifyResetPassword.params,
	typeof accountSchema.verifyResetPassword.body,
	typeof accountSchema.verifyResetPassword.query
> = async (request, reply) => {
	const token = await serviceWrapper(lucidServices.user.token.getSingle, {
		transaction: false,
		defaultError: {
			type: "basic",
			name: T("route_verify_password_reset_error_name"),
			message: T("route_verify_password_reset_error_message"),
			status: 500,
		},
	})(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			tokenType: "password_reset",
			token: request.params.token,
		},
	);
	if (token.error) throw new LucidAPIError(token.error);

	reply.status(204).send();
};

export default {
	controller: verifyResetPasswordController,
	zodSchema: accountSchema.verifyResetPassword,
	swaggerSchema: {
		description: "Verifies the password reset token is valid",
		tags: ["account"],
		summary: "Verify reset token",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
	},
};
