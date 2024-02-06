import rolesSchema from "../../schemas/roles.js";
import { swaggerResponse } from "../../utils/swagger/response-helpers.js";
import roles from "../../services/roles/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

const createSingleController: ControllerT<
	typeof rolesSchema.createSingle.params,
	typeof rolesSchema.createSingle.body,
	typeof rolesSchema.createSingle.query
> = async (request, reply) => {
	await serviceWrapper(roles.createSingle, true)(
		{
			db: request.server.db,
		},
		{
			name: request.body.name,
			permissionGroups: request.body.permission_groups,
		},
	);

	reply.status(204).send();
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
					default: "admin",
				},
				permission_groups: {
					type: "array",
					default: [
						{
							permissions: [
								"create_role",
								"update_role",
								"delete_role",
								"update_user",
								"create_user",
							],
						},
						{
							environment_key: "production",
							permissions: ["create_content"],
						},
					],
					items: {
						type: "object",
						properties: {
							permissions: {
								type: "array",
								items: {
									type: "string",
								},
								default: [
									"create_role",
									"delete_user",
									"update_user",
								],
							},
							environment_key: {
								type: "string",
							},
						},
						required: ["permissions"],
					},
				},
			},
		},
	},
};
