import T from "../../translations/index.js";
import usersSchema from "../../schemas/users.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import usersServices from "../../services/users/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import UsersFormatter from "../../libs/formatters/users.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";

const createSingleController: ControllerT<
	typeof usersSchema.createSingle.params,
	typeof usersSchema.createSingle.body,
	typeof usersSchema.createSingle.query
> = async (request, reply) => {
	try {
		const userId = await serviceWrapper(usersServices.createSingle, true)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				email: request.body.email,
				username: request.body.username,
				password: request.body.password,
				password_confirmation: request.body.password_confirmation,
				role_ids: request.body.role_ids,
				first_name: request.body.first_name,
				last_name: request.body.last_name,
				super_admin: request.body.super_admin,
				auth_super_admin: request.auth.super_admin,
			},
		);

		const user = await serviceWrapper(usersServices.getSingle, false)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				user_id: userId,
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
				service: T("user"),
				method: T("create"),
			}),
			message: T("default_error_message"),
			status: 500,
		});
	}
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
