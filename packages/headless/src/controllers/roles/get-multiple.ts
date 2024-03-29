import rolesSchema from "../../schemas/roles.js";
import {
	swaggerResponse,
	swaggerQueryString,
} from "../../utils/swagger-helpers.js";
import rolesServices from "../../services/roles/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import { swaggerRoleRes } from "../../format/format-roles.js";

const getMultipleController: ControllerT<
	typeof rolesSchema.getMultiple.params,
	typeof rolesSchema.getMultiple.body,
	typeof rolesSchema.getMultiple.query
> = async (request, reply) => {
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
				perPage: request.query.per_page,
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
					items: swaggerRoleRes,
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
					key: "role_ids",
				},
			],
			sorts: ["name", "created_at"],
			page: true,
			perPage: true,
		}),
	},
};
