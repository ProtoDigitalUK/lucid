import type { RoleResT } from "@headless/types/src/roles.js";

const formatRole = (role: {
	created_at: Date | null;
	id: number;
	name: string;
	description: string | null;
	updated_at: Date | null;
	permissions?: {
		id: number;
		permission: string;
		role_id: number;
	}[];
}): RoleResT => {
	return {
		id: role.id,
		name: role.name,
		description: role.description,
		permissions: role.permissions?.map((permission) => {
			return {
				id: permission.id,
				permission: permission.permission,
			};
		}),
		created_at: role.created_at?.toISOString() || null,
		updated_at: role.updated_at?.toISOString() || null,
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
				},
				{
					id: 2,
					permission: "update_role",
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
