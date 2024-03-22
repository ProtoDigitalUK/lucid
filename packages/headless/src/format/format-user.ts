import type { UserResT } from "@headless/types/src/users.js";
import formatUserPermissions, {
	swaggerPermissionsRes,
	swaggerRolesRes,
} from "./format-user-permissions.js";

const formatUser = (user: {
	created_at: Date | null;
	email: string;
	first_name: string | null;
	super_admin: boolean | null;
	id: number;
	last_name: string | null;
	updated_at: Date | null;
	username: string;
	roles?: {
		id: number;
		description: string | null;
		name: string;
		permissions?: {
			permission: string;
		}[];
	}[];
}): UserResT => {
	const { roles, permissions } = formatUserPermissions(user.roles);

	return {
		id: user.id,
		super_admin: user.super_admin || false,
		email: user.email,
		username: user.username,
		first_name: user.first_name,
		last_name: user.last_name,
		roles: roles,
		permissions: permissions,
		created_at: user.created_at?.toISOString() || null,
		updated_at: user.updated_at?.toISOString() || null,
	};
};

export const swaggerUsersRes = {
	type: "object",
	properties: {
		id: { type: "number", example: 1 },
		super_admin: { type: "boolean", example: false },
		email: { type: "string", example: "admin@headless.com" },
		username: { type: "string", example: "admin" },
		first_name: { type: "string", example: "Admin" },
		last_name: { type: "string", example: "User" },
		roles: swaggerRolesRes,
		permissions: swaggerPermissionsRes,
		created_at: { type: "string", example: "2021-06-10T20:00:00.000Z" },
		updated_at: { type: "string", example: "2021-06-10T20:00:00.000Z" },
	},
};

export default formatUser;
