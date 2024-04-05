import type { PermissionT } from "../../services/permissions.js";
import type { UserPermissionsResT } from "../../types/response.js";

interface UserPermissionRolesPropsT {
	id: number;
	description: string | null;
	name: string;
	permissions?: {
		permission: string;
	}[];
}

export default class UserPermissionsFormatter {
	formatMultiple = (props: {
		roles: UserPermissionRolesPropsT[];
	}): UserPermissionsResT => {
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
	static swaggerPermissions = {
		type: "array",
		items: {
			type: "string",
			example: "create_user",
		},
	};
	static swaggerRoles = {
		type: "array",
		items: {
			type: "object",
			properties: {
				id: { type: "number", example: 1 },
				name: { type: "string", example: "Admin" },
			},
		},
	};
}
