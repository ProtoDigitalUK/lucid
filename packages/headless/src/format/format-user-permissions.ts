import type { UserPermissionsResT } from "@headless/types/src/users.js";
import type { PermissionT } from "@headless/types/src/permissions.js";

interface FormatUserPermissionT {
	roles?: {
		id: number;
		description: string | null;
		name: string;
		permissions?: {
			permission: string;
		}[];
	}[];
}

const formatUserPermissions = (
	props: FormatUserPermissionT,
): UserPermissionsResT => {
	if (!props.roles) {
		return {
			roles: [],
			permissions: [],
		};
	}

	const permissionsSet: Set<PermissionT> = new Set();

	for (const role of props.roles) {
		if (!role.permissions) continue;
		for (const permission of role.permissions) {
			permissionsSet.add(permission.permission as PermissionT);
		}
	}

	return {
		roles: props.roles.map(({ id, name }) => ({ id, name })),
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
