import { type UserPermissionsResT } from "@headless/types/src/users.js";
import { type PermissionT } from "@headless/types/src/permissions.js";

const formatUserPermissions = (
	roles?: {
		id: number;
		description: string | null;
		name: string;
		permissions: {
			permission: string;
		}[];
	}[],
): UserPermissionsResT => {
	if (!roles) {
		return {
			roles: [],
			permissions: [],
		};
	}

	const permissionsSet: Set<PermissionT> = new Set();

	for (const role of roles) {
		for (const permission of role.permissions) {
			permissionsSet.add(permission.permission as PermissionT);
		}
	}

	return {
		roles: roles.map(({ id, name }) => ({ id, name })),
		permissions: Array.from(permissionsSet),
	};
};

export const swaggerPermissionsRes = {
	type: "array",
	items: {
		type: "string",
		example: "create_user",
	},
};

export const swaggerRolesRes = {
	type: "array",
	items: {
		type: "object",
		properties: {
			id: { type: "number", example: 1 },
			name: { type: "string", example: "Admin" },
		},
	},
};

export default formatUserPermissions;
