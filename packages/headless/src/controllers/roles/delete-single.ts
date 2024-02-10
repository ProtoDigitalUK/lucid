import rolesSchema from "../../schemas/roles.js";
import { swaggerResponse } from "../../utils/swagger/response-helpers.js";
import rolesServices from "../../services/roles/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

const deleteSingleController: ControllerT<
	typeof rolesSchema.deleteSingle.params,
	typeof rolesSchema.deleteSingle.body,
	typeof rolesSchema.deleteSingle.query
> = async (request, reply) => {
	await serviceWrapper(rolesServices.deleteSingle, true)(
		{
			db: request.server.db,
		},
		{
			id: parseInt(request.params.id),
		},
	);

	reply.status(204).send();
};

export default {
	controller: deleteSingleController,
	zodSchema: rolesSchema.deleteSingle,
	swaggerSchema: {
		description: "Delete a single role based on the given role id.",
		tags: ["roles"],
		summary: "Delete a single role",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
	},
};
