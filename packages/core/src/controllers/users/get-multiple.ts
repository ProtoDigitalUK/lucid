import T from "../../translations/index.js";
import usersSchema from "../../schemas/users.js";
import {
	swaggerResponse,
	swaggerQueryString,
} from "../../utils/swagger-helpers.js";
import usersServices from "../../services/users/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import UsersFormatter from "../../libs/formatters/users.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";
import type { RouteController } from "../../types/types.js";

const getMultipleController: RouteController<
	typeof usersSchema.getMultiple.params,
	typeof usersSchema.getMultiple.body,
	typeof usersSchema.getMultiple.query
> = async (request, reply) => {
	try {
		const users = await serviceWrapper(usersServices.getMultiple, false)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				query: request.query,
			},
		);

		reply.status(200).send(
			await buildResponse(request, {
				data: users.data,
				pagination: {
					count: users.count,
					page: request.query.page,
					perPage: request.query.perPage,
				},
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
	controller: getMultipleController,
	zodSchema: usersSchema.getMultiple,
	swaggerSchema: {
		description: "Get multiple users.",
		tags: ["users"],
		summary: "Get multiple users.",
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "array",
					items: UsersFormatter.swagger,
				},
				paginated: true,
			}),
		},
		querystring: swaggerQueryString({
			filters: [
				{
					key: "firstName",
				},
				{
					key: "lastName",
				},
				{
					key: "email",
				},
				{
					key: "username",
				},
				{
					key: "roleIds",
				},
			],
			sorts: [
				"createdAt",
				"updatedAt",
				"firstName",
				"lastName",
				"email",
				"username",
			],
			page: true,
			perPage: true,
		}),
	},
};
