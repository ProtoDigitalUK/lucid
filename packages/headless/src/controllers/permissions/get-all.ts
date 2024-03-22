import permissionsSchema from "../../schemas/permissions.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import buildResponse from "../../utils/build-response.js";
import formatPermissions from "../../format/format-permissions.js";
import { permissionGroups } from "../../services/permissions.js";

const getAllController: ControllerT<
	typeof permissionsSchema.getAll.params,
	typeof permissionsSchema.getAll.body,
	typeof permissionsSchema.getAll.query
> = async (request, reply) => {
	const permissionsRes = formatPermissions(permissionGroups);

	reply.status(200).send(
		await buildResponse(request, {
			data: permissionsRes,
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
					items: {
						type: "object",
						properties: {
							key: {
								type: "string",
								example: "users_permissions",
							},
							permissions: {
								type: "array",
								example: [
									"create_user",
									"update_user",
									"delete_user",
								],
							},
						},
					},
				},
			}),
		},
	},
};
