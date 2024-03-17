import usersSchema from "../../schemas/users.js";
import {
	swaggerResponse,
	swaggerQueryString,
} from "../../utils/swagger/response-helpers.js";
import usersServices from "../../services/users/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import buildResponse from "../../utils/app/build-response.js";
import { swaggerUsersRes } from "../../format/format-user.js";

const getMultipleController: ControllerT<
	typeof usersSchema.getMultiple.params,
	typeof usersSchema.getMultiple.body,
	typeof usersSchema.getMultiple.query
> = async (request, reply) => {
	const users = await serviceWrapper(usersServices.getMultiple, false)(
		{
			db: request.server.db,
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
				perPage: request.query.per_page,
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
					items: swaggerUsersRes,
				},
				paginated: true,
			}),
		},
		querystring: swaggerQueryString({
			filters: [
				{
					key: "first_name",
				},
				{
					key: "last_name",
				},
				{
					key: "email",
				},
				{
					key: "username",
				},
				{
					key: "role_ids",
				},
			],
			sorts: [
				"created_at",
				"updated_at",
				"first_name",
				"last_name",
				"email",
				"username",
			],
			page: true,
			perPage: true,
		}),
	},
};
