import T from "../../translations/index.js";
import usersSchema from "../../schemas/users.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import usersServices from "../../services/users/index.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import type { RouteController } from "../../types/types.js";

const deleteSingleController: RouteController<
	typeof usersSchema.deleteSingle.params,
	typeof usersSchema.deleteSingle.body,
	typeof usersSchema.deleteSingle.query
> = async (request, reply) => {
	const deleteSingle = await serviceWrapper(usersServices.deleteSingle, {
		transaction: true,
		defaultError: {
			type: "basic",
			name: T("method_error_name", {
				name: T("user"),
				method: T("delete"),
			}),
			message: T("deletion_error_message", {
				name: T("user").toLowerCase(),
			}),
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
