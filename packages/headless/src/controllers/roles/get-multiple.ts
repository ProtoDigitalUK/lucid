import rolesSchema from "../../schemas/roles.js";
import { swaggerResponse } from "../../utils/swagger/response-helpers.js";
import rolesServices from "../../services/roles/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import buildResponse from "../../utils/app/build-response.js";
import { swaggerRoleRes } from "../../format/format-roles.js";

const getMultipleController: ControllerT<
	typeof rolesSchema.getMultiple.params,
	typeof rolesSchema.getMultiple.body,
	typeof rolesSchema.getMultiple.query
> = async (request, reply) => {
	const role = await serviceWrapper(rolesServices.getMultiple, false)(
		{
			db: request.server.db,
		},
		{
			query: request.query,
		},
	);

	reply.status(200).send(
		await buildResponse(request, {
			data: role,
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
			}),
		},
	},
};
