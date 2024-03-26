import type { UserResT } from "@headless/types/src/users.js";
import formatUserPermissions, {
	swaggerPermissionsRes,
	swaggerRolesRes,
} from "./format-user-permissions.js";
import { formatDate } from "../utils/format-helpers.js";

interface FormatUserT {
	user: {
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
	};
}

const formatUser = (props: FormatUserT): UserResT => {
	const { roles, permissions } = formatUserPermissions({
		roles: props.user.roles,
	});

	return {
		id: props.user.id,
		super_admin: props.user.super_admin || false,
		email: props.user.email,
		username: props.user.username,
		first_name: props.user.first_name,
		last_name: props.user.last_name,
		roles: roles,
		permissions: permissions,
		created_at: formatDate(props.user.created_at),
		updated_at: formatDate(props.user.updated_at),
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
