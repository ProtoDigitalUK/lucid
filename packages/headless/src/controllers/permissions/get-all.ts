import permissionsSchema from "../../schemas/permissions.js";
import { swaggerResponse } from "../../utils/swagger/response-helpers.js";
import buildResponse from "../../utils/app/build-response.js";
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
		description:
			"Returns a list of all permissions available for users. Global permissions control access to CMS wide features, while environment permissions control access to specific environment features and can be different for each environment.",
		tags: ["permissions"],
		summary: "Get all permissions",
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "object",
					properties: {
						global: {
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
						environment: {
							type: "array",
							items: {
								type: "object",
								properties: {
									key: {
										type: "string",
										example: "content_permissions",
									},
									permissions: {
										type: "array",
										example: [
											"create_content",
											"update_content",
											"delete_content",
											"publish_content",
											"unpublish_content",
										],
									},
								},
							},
						},
					},
				},
			}),
		},
	},
};
