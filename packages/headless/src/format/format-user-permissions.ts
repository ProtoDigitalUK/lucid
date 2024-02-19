import {
	type UserPermissionsResT,
	type UserEnvrionmentResT,
} from "@headless/types/src/users.js";
import {
	type PermissionT,
	type EnvironmentPermissionT,
} from "@headless/types/src/permissions.js";

const formatUserPermissions = (
	roles?: {
		id: number;
		description: string | null;
		name: string;
		permissions: {
			permission: string;
			environment_key: string | null;
		}[];
	}[],
): UserPermissionsResT => {
	if (!roles) {
		return {
			roles: [],
			permissions: {
				global: [],
				environments: [],
			},
		};
	}

	const environmentsMap: Map<string, EnvironmentPermissionT[]> = new Map();
	const permissionsSet: Set<PermissionT> = new Set();

	for (const role of roles) {
		for (const permission of role.permissions) {
			if (permission.environment_key) {
				if (!environmentsMap.has(permission.environment_key)) {
					environmentsMap.set(permission.environment_key, []);
				}
				const envPermissions = environmentsMap.get(
					permission.environment_key,
				);
				if (
					envPermissions &&
					!envPermissions.includes(
						permission.permission as EnvironmentPermissionT,
					)
				) {
					envPermissions.push(
						permission.permission as EnvironmentPermissionT,
					);
				}
			} else {
				permissionsSet.add(permission.permission as PermissionT);
			}
		}
	}

	// Convert the environments map to the desired array structure
	const environments = Array.from(environmentsMap, ([key, permissions]) => ({
		key,
		permissions,
	}));

	return {
		roles: roles.map(({ id, name }) => ({ id, name })),
		permissions: {
			global: Array.from(permissionsSet),
			environments,
		},
	};
};

export const swaggerPermissionsRes = {
	type: "object",
	properties: {
		global: {
			type: "array",
			items: {
				type: "string",
			},
		},
		environments: {
			type: "array",
			items: {
				type: "object",
				properties: {
					key: {
						type: "string",
					},
					permissions: {
						type: "array",
						items: {
							type: "string",
						},
					},
				},
			},
		},
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
