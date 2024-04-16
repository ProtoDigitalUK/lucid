import T from "../../translations/index.js";
import usersSchema from "../../schemas/users.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import usersServices from "../../services/users/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import UsersFormatter from "../../libs/formatters/users.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";
import type { RouteController } from "../../types/types.js";

const createSingleController: RouteController<
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
				passwordConfirmation: request.body.passwordConfirmation,
				roleIds: request.body.roleIds,
				firstName: request.body.firstName,
				lastName: request.body.lastName,
				superAdmin: request.body.superAdmin,
				authSuperAdmin: request.auth.superAdmin,
			},
		);

		const user = await serviceWrapper(usersServices.getSingle, false)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				userId: userId,
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
				method: T("create"),
			}),
			message: T("creation_error_message", {
				name: T("user").toLowerCase(),
			}),
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
