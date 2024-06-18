import T from "../../translations/index.js";
import usersSchema from "../../schemas/users.js";
import {
	swaggerResponse,
	swaggerQueryString,
} from "../../utils/swagger-helpers.js";
import lucidServices from "../../services/index.js";
import buildResponse from "../../utils/build-response.js";
import UsersFormatter from "../../libs/formatters/users.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import type { RouteController } from "../../types/types.js";

const getMultipleController: RouteController<
	typeof usersSchema.getMultiple.params,
	typeof usersSchema.getMultiple.body,
	typeof usersSchema.getMultiple.query
> = async (request, reply) => {
	const users = await serviceWrapper(lucidServices.user.getMultiple, {
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
			query: request.query,
			auth: {
				id: request.auth.id,
			},
		},
	);
	if (users.error) throw new LucidAPIError(users.error);

	reply.status(200).send(
		await buildResponse(request, {
			data: users.data.data,
			pagination: {
				count: users.data.count,
				page: request.query.page,
				perPage: request.query.perPage,
			},
		}),
	);
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
