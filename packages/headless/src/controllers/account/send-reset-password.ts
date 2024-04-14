import T from "../../translations/index.js";
import accountSchema from "../../schemas/account.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import buildResponse from "../../utils/build-response.js";
import account from "../../services/account/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";

const sendResetPasswordController: ControllerT<
	typeof accountSchema.sendResetPassword.params,
	typeof accountSchema.sendResetPassword.body,
	typeof accountSchema.sendResetPassword.query
> = async (request, reply) => {
	try {
		const resetPassword = await serviceWrapper(
			account.sendResetPassword,
			true,
		)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				email: request.body.email,
			},
		);

		reply.status(200).send(
			await buildResponse(request, {
				data: resetPassword,
			}),
		);
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
	controller: sendResetPasswordController,
	zodSchema: accountSchema.sendResetPassword,
	swaggerSchema: {
		description: "Sends a reset password email to the given users email",
		tags: ["account"],
		summary: "Send reset password email",
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "object",
					properties: {
						message: { type: "string" },
					},
				},
			}),
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
