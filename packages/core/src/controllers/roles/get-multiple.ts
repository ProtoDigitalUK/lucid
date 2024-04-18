import T from "../../translations/index.js";
import rolesSchema from "../../schemas/roles.js";
import {
	swaggerResponse,
	swaggerQueryString,
} from "../../utils/swagger-helpers.js";
import rolesServices from "../../services/roles/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import RolesFormatter from "../../libs/formatters/roles.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";
import type { RouteController } from "../../types/types.js";

const getMultipleController: RouteController<
	typeof rolesSchema.getMultiple.params,
	typeof rolesSchema.getMultiple.body,
	typeof rolesSchema.getMultiple.query
> = async (request, reply) => {
	try {
		const role = await serviceWrapper(rolesServices.getMultiple, false)(
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
				data: role.data,
				pagination: {
					count: role.count,
					page: request.query.page,
					perPage: request.query.perPage,
				},
			}),
		);
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				name: T("role"),
				method: T("fetch"),
			}),
			message: T("default_error_message"),
			status: 500,
		});
	}
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
