import {
	type UserPermissionsResT,
	type UserResT,
} from "@headless/types/src/users.js";
import { type UsersT } from "../db/schema.js";
import {
	swaggerPermissionsRes,
	swaggerRolesRes,
} from "./format-user-permissions.js";

const formatUser = (
	user: UsersT,
	permissions?: UserPermissionsResT,
): UserResT => {
	return {
		id: user.id,
		super_admin: user.super_admin || false,
		email: user.email,
		username: user.username,
		first_name: user.first_name,
		last_name: user.last_name,
		roles: permissions?.roles,
		permissions: permissions?.permissions,
		created_at: user.created_at,
		updated_at: user.updated_at,
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
