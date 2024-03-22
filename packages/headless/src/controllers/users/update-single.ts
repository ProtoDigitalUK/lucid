import usersSchema from "../../schemas/users.js";
import { swaggerResponse } from "../../utils/swagger/response-helpers.js";
import usersServices from "../../services/users/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

const updateSingleController: ControllerT<
	typeof usersSchema.updateSingle.params,
	typeof usersSchema.updateSingle.body,
	typeof usersSchema.updateSingle.query
> = async (request, reply) => {
	await serviceWrapper(usersServices.updateSingle, true)(
		{
			db: request.server.db,
		},
		{
			user_id: Number.parseInt(request.params.id),
			role_ids: request.body.role_ids,
			super_admin: request.body.super_admin,
			auth_super_admin: request.auth.super_admin,
		},
	);

	reply.status(204).send();
};

export default {
	controller: updateSingleController,
	zodSchema: usersSchema.updateSingle,
	swaggerSchema: {
		description: "Update a single user.",
		tags: ["users"],
		summary: "Update a single user.",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
	},
};
