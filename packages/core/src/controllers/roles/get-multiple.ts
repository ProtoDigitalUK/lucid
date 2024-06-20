import T from "../../translations/index.js";
import rolesSchema from "../../schemas/roles.js";
import {
	swaggerResponse,
	swaggerQueryString,
} from "../../utils/swagger/index.js";
import lucidServices from "../../services/index.js";
import buildResponse from "../../utils/build-response.js";
import RolesFormatter from "../../libs/formatters/roles.js";
import serviceWrapper from "../../utils/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/errors/index.js";
import type { RouteController } from "../../types/types.js";

const getMultipleController: RouteController<
	typeof rolesSchema.getMultiple.params,
	typeof rolesSchema.getMultiple.body,
	typeof rolesSchema.getMultiple.query
> = async (request, reply) => {
	const role = await serviceWrapper(lucidServices.role.getMultiple, {
		transaction: false,
		defaultError: {
			type: "basic",
			name: T("route_roles_fetch_error_name"),
			message: T("route_roles_fetch_error_message"),
			status: 500,
		},
	})(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			query: request.query,
		},
	);
	if (role.error) throw new LucidAPIError(role.error);

	reply.status(200).send(
		await buildResponse(request, {
			data: role.data.data,
			pagination: {
				count: role.data.count,
				page: request.query.page,
				perPage: request.query.perPage,
			},
		}),
	);
};

export default {
	controller: getMultipleController,
	zodSchema: rolesSchema.getMultiple,
	swaggerSchema: {
		description: "Returns multiple roles based on the query parameters.",
		tags: ["roles"],
		summary: "Get multiple roles",
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "array",
					items: RolesFormatter.swagger,
				},
				paginated: true,
			}),
		},
		querystring: swaggerQueryString({
			include: ["permissions"],
			filters: [
				{
					key: "name",
				},
				{
					key: "roleIds",
				},
			],
			sorts: ["name", "createdAt"],
			page: true,
			perPage: true,
		}),
	},
};
