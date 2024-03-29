import usersSchema from "../../schemas/users.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import usersServices from "../../services/users/index.js";

const deleteSingleController: ControllerT<
	typeof usersSchema.deleteSingle.params,
	typeof usersSchema.deleteSingle.body,
	typeof usersSchema.deleteSingle.query
> = async (request, reply) => {
	await serviceWrapper(usersServices.deleteSingle, true)(
		{
			config: request.server.config,
		},
		{
			user_id: Number.parseInt(request.params.id),
			current_user_id: request.auth.id,
		},
	);

	reply.status(204).send();
};

export default {
	controller: deleteSingleController,
	zodSchema: usersSchema.deleteSingle,
	swaggerSchema: {
		description:
			"Delete a single user item by id. This is a soft delete so that the user may be restored later if needed.",
		tags: ["users"],
		summary: "Delete a single user.",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
