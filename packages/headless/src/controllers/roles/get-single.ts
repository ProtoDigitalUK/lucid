import rolesSchema from "../../schemas/roles.js";
import { swaggerResponse } from "../../utils/swagger/response-helpers.js";
import rolesServices from "../../services/roles/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import buildResponse from "../../utils/app/build-response.js";
import { swaggerRoleRes } from "../../format/format-roles.js";

const getSingleController: ControllerT<
	typeof rolesSchema.getSingle.params,
	typeof rolesSchema.getSingle.body,
	typeof rolesSchema.getSingle.query
> = async (request, reply) => {
	const role = await serviceWrapper(rolesServices.getSingle, false)(
		{
			db: request.server.db,
		},
		{
			id: parseInt(request.params.id, 10),
		},
	);

	reply.status(200).send(
		await buildResponse(request, {
			data: role,
		}),
	);
};

export default {
	controller: getSingleController,
	zodSchema: rolesSchema.getSingle,
	swaggerSchema: {
		description: "Returns a single role based on the id URL paramater.",
		tags: ["roles"],
		summary: "Get a single role",
		response: {
			200: swaggerResponse({
				type: 200,
				data: swaggerRoleRes,
			}),
		},
	},
};
