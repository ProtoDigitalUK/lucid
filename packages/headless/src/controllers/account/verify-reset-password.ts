import T from "../../translations/index.js";
import accountSchema from "../../schemas/account.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import userTokens from "../../services/user-tokens/index.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";

const verifyResetPasswordController: ControllerT<
	typeof accountSchema.verifyResetPassword.params,
	typeof accountSchema.verifyResetPassword.body,
	typeof accountSchema.verifyResetPassword.query
> = async (request, reply) => {
	try {
		await serviceWrapper(userTokens.getSingle, false)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				token_type: "password_reset",
				token: request.params.token,
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
