import T from "../../translations/index.js";
import accountSchema from "../../schemas/account.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import buildResponse from "../../utils/build-response.js";
import usersServices from "../../services/users/index.js";
import UsersFormatter from "../../libs/formatters/users.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import type { RouteController } from "../../types/types.js";

const getMeController: RouteController<
	typeof accountSchema.getMe.params,
	typeof accountSchema.getMe.body,
	typeof accountSchema.getMe.query
> = async (request, reply) => {
	const user = await serviceWrapper(usersServices.getSingle, {
		transaction: false,
		defaultError: {
			type: "basic",
			name: T("method_error_name", {
				name: T("user"),
				method: T("fetch"),
			}),
			message: T("default_error_message"),
			status: 500,
		},
	})(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			userId: request.auth.id,
		},
	);
	if (user.error) throw new LucidAPIError(user.error);

	reply.status(200).send(
		await buildResponse(request, {
			data: user.data,
		}),
	);
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
