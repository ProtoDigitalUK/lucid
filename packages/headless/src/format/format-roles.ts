import type { RoleResT } from "@headless/types/src/roles.js";

interface FormatRoleT {
	role: {
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
	};
}

const formatRole = (props: FormatRoleT): RoleResT => {
	return {
		id: props.role.id,
		name: props.role.name,
		description: props.role.description,
		permissions: props.role.permissions?.map((p) => {
			return {
				id: p.id,
				permission: p.permission,
			};
		}),
		created_at: props.role.created_at?.toISOString() || null,
		updated_at: props.role.updated_at?.toISOString() || null,
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
