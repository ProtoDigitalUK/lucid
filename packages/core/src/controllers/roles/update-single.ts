import T from "../../translations/index.js";
import rolesSchema from "../../schemas/roles.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import lucidServices from "../../services/index.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import type { RouteController } from "../../types/types.js";

const updateSingleController: RouteController<
	typeof rolesSchema.updateSingle.params,
	typeof rolesSchema.updateSingle.body,
	typeof rolesSchema.updateSingle.query
> = async (request, reply) => {
	const updateSingel = await serviceWrapper(lucidServices.role.updateSingle, {
		transaction: true,
		defaultError: {
			type: "basic",
			name: T("route_roles_update_error_name"),
			message: T("route_roles_update_error_message"),
			status: 500,
		},
	})(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			id: Number.parseInt(request.params.id),
			name: request.body.name,
			description: request.body.description,
			permissions: request.body.permissions,
		},
	);
	if (updateSingel.error) throw new LucidAPIError(updateSingel.error);

	reply.status(204).send();
};

export default {
	controller: updateSingleController,
	zodSchema: rolesSchema.updateSingle,
	swaggerSchema: {
		description:
			"Update a single role with the given name and permission groups.",
		tags: ["roles"],
		summary: "Update a single role",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
		body: {
			type: "object",
			properties: {
				name: {
					type: "string",
				},
				description: {
					type: "string",
				},
				permissions: {
					type: "array",
					items: {
						type: "string",
					},
				},
			},
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
