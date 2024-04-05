import permissionsSchema from "../../schemas/permissions.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import buildResponse from "../../utils/build-response.js";
import { permissionGroups } from "../../services/permissions.js";
import Formatter from "../../libs/formatters/index.js";
import PermissionsFormatter from "../../libs/formatters/permissions.js";

const getAllController: ControllerT<
	typeof permissionsSchema.getAll.params,
	typeof permissionsSchema.getAll.body,
	typeof permissionsSchema.getAll.query
> = async (request, reply) => {
	const PermissionsFormatter = Formatter.get("permissions");

	reply.status(200).send(
		await buildResponse(request, {
			data: PermissionsFormatter.formatMultiple({
				permissions: permissionGroups,
			}),
		}),
	);
};

export default {
	controller: getAllController,
	zodSchema: permissionsSchema.getAll,
	swaggerSchema: {
		description: "Returns a list of all permissions available for users.",
		tags: ["permissions"],
		summary: "Get all permissions",
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "array",
					items: PermissionsFormatter.swagger,
				},
			}),
		},
	},
};
