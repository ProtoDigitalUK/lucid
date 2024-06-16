import T from "../../translations/index.js";
import usersSchema from "../../schemas/users.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import LucidServices from "../../services/index.js";
import buildResponse from "../../utils/build-response.js";
import UsersFormatter from "../../libs/formatters/users.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import type { RouteController } from "../../types/types.js";

const createSingleController: RouteController<
	typeof usersSchema.createSingle.params,
	typeof usersSchema.createSingle.body,
	typeof usersSchema.createSingle.query
> = async (request, reply) => {
	const userId = await serviceWrapper(LucidServices.user.createSingle, {
		transaction: true,
		defaultError: {
			type: "basic",
			name: T("route_user_create_error_name"),
			message: T("route_user_create_error_message"),
			status: 500,
		},
	})(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			email: request.body.email,
			username: request.body.username,
			roleIds: request.body.roleIds,
			firstName: request.body.firstName,
			lastName: request.body.lastName,
			superAdmin: request.body.superAdmin,
			authSuperAdmin: request.auth.superAdmin,
		},
	);
	if (userId.error) throw new LucidAPIError(userId.error);

	const user = await serviceWrapper(LucidServices.user.getSingle, {
		transaction: false,
		defaultError: {
			type: "basic",
			name: T("route_user_fetch_error_name"),
			message: T("route_user_fetch_error_message"),
			status: 500,
		},
	})(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			userId: userId.data,
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
	controller: createSingleController,
	zodSchema: usersSchema.createSingle,
	swaggerSchema: {
		description: "Create a single user.",
		tags: ["users"],
		summary: "Create a single user.",
		response: {
			200: swaggerResponse({
				type: 200,
				data: UsersFormatter.swagger,
			}),
		},
	},
};
