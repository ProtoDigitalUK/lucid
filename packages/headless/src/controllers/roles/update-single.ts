import T from "../../translations/index.js";
import rolesSchema from "../../schemas/roles.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import rolesServices from "../../services/roles/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";

const updateSingleController: ControllerT<
	typeof rolesSchema.updateSingle.params,
	typeof rolesSchema.updateSingle.body,
	typeof rolesSchema.updateSingle.query
> = async (request, reply) => {
	try {
		await serviceWrapper(rolesServices.updateSingle, true)(
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

		reply.status(204).send();
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				service: T("role"),
				method: T("update"),
			}),
			message: T("default_error_message"),
			status: 500,
		});
	}
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
