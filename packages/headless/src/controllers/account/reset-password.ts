import accountSchema from "../../schemas/account.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import account from "../../services/account/index.js";

const resetPasswordController: ControllerT<
	typeof accountSchema.resetPassword.params,
	typeof accountSchema.resetPassword.body,
	typeof accountSchema.resetPassword.query
> = async (request, reply) => {
	await serviceWrapper(account.resetPassword, true)(
		{
			db: request.server.db,
		},
		{
			token: request.params.token,
			password: request.body.password,
		},
	);

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
