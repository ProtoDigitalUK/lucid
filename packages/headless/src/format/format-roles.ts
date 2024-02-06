import { RoleResT } from "@headless/types/src/roles.js";
import { type RolesWithRelationsT } from "../db/schema.js";

const formatRole = (role: RolesWithRelationsT): RoleResT => {
	return {
		id: role.id,
		name: role.name,
		description: role.description,
		permissions: role.permissions.map((permission) => {
			return {
				id: permission.id,
				permission: permission.permission,
				environment_key: permission.environment_key,
			};
		}),
		created_at: role.created_at,
		updated_at: role.updated_at,
	};
};

export const swaggerRoleRes = {
	type: "object",
	properties: {
		id: { type: "number" },
		name: {
			type: "string",
			example: "Admin",
		},
		description: {
			type: "string",
			example: "Admin role description",
		},
		permissions: {
			type: "array",
			example: [
				{
					id: 1,
					permission: "create_role",
					environment_key: null,
				},
				{
					id: 2,
					permission: "update_role",
					environment_key: "production",
				},
			],
			items: {
				type: "object",
				properties: {
					id: {
						type: "number",
					},
					permission: {
						type: "string",
					},
					environment_key: {
						type: ["string", "null"],
					},
				},
			},
		},
		created_at: {
			type: "string",
			example: "2021-06-10T20:00:00.000Z",
		},
		updated_at: {
			type: "string",
			example: "2021-06-10T20:00:00.000Z",
		},
	},
};

export default formatRole;
