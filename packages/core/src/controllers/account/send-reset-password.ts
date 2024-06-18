import T from "../../translations/index.js";
import accountSchema from "../../schemas/account.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import buildResponse from "../../utils/build-response.js";
import lucidServices from "../../services/index.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import type { RouteController } from "../../types/types.js";

const sendResetPasswordController: RouteController<
	typeof accountSchema.sendResetPassword.params,
	typeof accountSchema.sendResetPassword.body,
	typeof accountSchema.sendResetPassword.query
> = async (request, reply) => {
	const resetPassword = await serviceWrapper(
		lucidServices.account.sendResetPassword,
		{
			transaction: true,
			defaultError: {
				type: "basic",
				name: T("route_send_password_reset_error_name"),
				message: T("route_send_password_reset_error_message"),
				status: 500,
			},
		},
	)(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			email: request.body.email,
		},
	);
	if (resetPassword.error) throw new LucidAPIError(resetPassword.error);

	reply.status(200).send(
		await buildResponse(request, {
			data: resetPassword.data,
		}),
	);
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
