import rolesSchema from "../../schemas/roles.js";
import { swaggerResponse } from "../../utils/swagger/response-helpers.js";
import rolesServices from "../../services/roles/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import buildResponse from "../../utils/app/build-response.js";
import { swaggerRoleRes } from "../../format/format-roles.js";

const createSingleController: ControllerT<
	typeof rolesSchema.createSingle.params,
	typeof rolesSchema.createSingle.body,
	typeof rolesSchema.createSingle.query
> = async (request, reply) => {
	const roleId = await serviceWrapper(rolesServices.createSingle, true)(
		{
			db: request.server.db,
		},
		{
			name: request.body.name,
			description: request.body.description,
			permissionGroups: request.body.permission_groups,
		},
	);

	const role = await serviceWrapper(rolesServices.getSingle, false)(
		{
			db: request.server.db,
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
				data: swaggerRoleRes,
			}),
		},
		body: {
			type: "object",
			properties: {
				name: {
					type: "string",
					default: "Admin",
				},
				description: {
					type: "string",
					default: "Admin role description",
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
