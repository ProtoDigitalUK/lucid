import T from "../../translations/index.js";
import usersSchema from "../../schemas/users.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import usersServices from "../../services/users/index.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import type { RouteController } from "../../types/types.js";

const updateSingleController: RouteController<
	typeof usersSchema.updateSingle.params,
	typeof usersSchema.updateSingle.body,
	typeof usersSchema.updateSingle.query
> = async (request, reply) => {
	const udapteUser = await serviceWrapper(usersServices.updateSingle, {
		transaction: true,
		defaultError: {
			type: "basic",
			name: T("method_error_name", {
				name: T("user"),
				method: T("update"),
			}),
			message: T("update_error_message", {
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
			auth: {
				id: request.auth.id,
				superAdmin: request.auth.superAdmin,
			},
			userId: Number.parseInt(request.params.id),
			roleIds: request.body.roleIds,
			superAdmin: request.body.superAdmin,
			triggerPasswordReset: request.body.triggerPasswordReset,
			isDeleted: request.body.isDeleted,
		},
	);
	if (udapteUser.error) throw new LucidAPIError(udapteUser.error);

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
