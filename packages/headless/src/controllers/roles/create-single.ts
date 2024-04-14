import T from "../../translations/index.js";
import rolesSchema from "../../schemas/roles.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import rolesServices from "../../services/roles/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import RolesFormatter from "../../libs/formatters/roles.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";

const createSingleController: ControllerT<
	typeof rolesSchema.createSingle.params,
	typeof rolesSchema.createSingle.body,
	typeof rolesSchema.createSingle.query
> = async (request, reply) => {
	try {
		const roleId = await serviceWrapper(rolesServices.createSingle, true)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				name: request.body.name,
				description: request.body.description,
				permissions: request.body.permissions,
			},
		);

		const role = await serviceWrapper(rolesServices.getSingle, false)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				id: roleId,
			},
		);

		reply.status(200).send(
			await buildResponse(request, {
				data: role,
			}),
		);
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				service: T("role"),
				method: T("create"),
			}),
			message: T("default_error_message"),
			status: 500,
		});
	}
};

export default {
	controller: createSingleController,
	zodSchema: rolesSchema.createSingle,
	swaggerSchema: {
		description:
			"Create a single role with the given name and permission groups.",
		tags: ["roles"],
		summary: "Create a single role",
		response: {
			200: swaggerResponse({
				type: 200,
				data: RolesFormatter.swagger,
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
			required: ["name", "permissions"],
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
