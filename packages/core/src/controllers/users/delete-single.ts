import T from "../../translations/index.js";
import usersSchema from "../../schemas/users.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import lucidServices from "../../services/index.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import type { RouteController } from "../../types/types.js";

const deleteSingleController: RouteController<
	typeof usersSchema.deleteSingle.params,
	typeof usersSchema.deleteSingle.body,
	typeof usersSchema.deleteSingle.query
> = async (request, reply) => {
	const deleteSingle = await serviceWrapper(lucidServices.user.deleteSingle, {
		transaction: true,
		defaultError: {
			type: "basic",
			name: T("route_user_delete_error_name"),
			message: T("route_user_delete_error_message"),
			status: 500,
		},
	})(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			userId: Number.parseInt(request.params.id),
			currentUserId: request.auth.id,
		},
	);
	if (deleteSingle.error) throw new LucidAPIError(deleteSingle.error);

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
