import accountSchema from "../../schemas/account.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import buildResponse from "../../utils/build-response.js";
import account from "../../services/account/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";

const sendResetPasswordController: ControllerT<
	typeof accountSchema.sendResetPassword.params,
	typeof accountSchema.sendResetPassword.body,
	typeof accountSchema.sendResetPassword.query
> = async (request, reply) => {
	const resetPassword = await serviceWrapper(account.sendResetPassword, true)(
		{
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
