import T from "../../translations/index.js";
import accountSchema from "../../schemas/account.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import buildResponse from "../../utils/build-response.js";
import usersServices from "../../services/users/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import UsersFormatter from "../../libs/formatters/users.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";

const getMeController: ControllerT<
	typeof accountSchema.getMe.params,
	typeof accountSchema.getMe.body,
	typeof accountSchema.getMe.query
> = async (request, reply) => {
	try {
		const user = await serviceWrapper(usersServices.getSingle, false)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				userId: request.auth.id,
			},
		);

		reply.status(200).send(
			await buildResponse(request, {
				data: user,
			}),
		);
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				name: T("user"),
				method: T("fetch"),
			}),
			message: T("default_error_message"),
			status: 500,
		});
	}
};

export default {
	controller: getMeController,
	zodSchema: accountSchema.getMe,
	swaggerSchema: {
		description: "Returns user data based on the authenticated user",
		tags: ["account"],
		summary: "Returns user data based on the authenticated user",
		response: {
			200: swaggerResponse({
				type: 200,
				data: UsersFormatter.swagger,
			}),
		},
	},
};
