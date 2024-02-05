import {
	APIError,
	type ErrorResultT,
	modelErrors,
} from "../../utils/app/error-handler.js";
import getPermissions from "../permissions.js";
import {
	type PermissionT,
	type EnvironmentPermissionT,
} from "@headless/types/src/permissions.js";

export interface ServiceData {
	permissionGroups: {
		permissions: string[];
		environment_key?: string | undefined;
	}[];
}

const validatePermissions = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.permissionGroups.length === 0) return [];

	const permissionSet = getPermissions();
	const environmentsRes = await serviceConfig.db.query.environments.findMany({
		columns: {
			key: true,
		},
	});

	// Data
	const validPermissions: Array<{
		permission: PermissionT | EnvironmentPermissionT;
		environment_key?: string;
	}> = [];

	const permissionErrors: ErrorResultT = {};
	const environmentErrors: ErrorResultT = {};

	// Loop through the permissions array
	for (const obj of data.permissionGroups) {
		const envKey = obj.environment_key;
		for (let i = 0; i < obj.permissions.length; i++) {
			const permission = obj.permissions[i] as
				| PermissionT
				| EnvironmentPermissionT;

			// Check against global permissions
			if (!envKey) {
				if (permissionSet.global.includes(permission as PermissionT)) {
					validPermissions.push({
						permission,
					});
				} else {
					if (!permissionErrors[permission]) {
						permissionErrors[permission] = {
							key: permission,
							code: "Invalid Permission",
							message: `The permission "${permission}" is invalid against global permissions.`,
						};
					}
				}
			}
			// Check against environment permissions
			else {
				if (
					permissionSet.environment.includes(
						permission as EnvironmentPermissionT,
					)
				) {
					// Check if the environment key is valid
					const env = environmentsRes.find((e) => e.key === envKey);
					if (!env) {
						if (!environmentErrors[envKey]) {
							environmentErrors[envKey] = {
								key: envKey,
								code: "Invalid Environment",
								message: `The environment key "${envKey}" is invalid.`,
							};
						}
					} else {
						validPermissions.push({
							permission,
							environment_key: envKey,
						});
					}
				} else {
					if (!permissionErrors[permission]) {
						permissionErrors[permission] = {
							key: permission,
							code: "Invalid Permission",
							message: `The permission "${permission}" is invalid against environment permissions.`,
						};
					}
				}
			}
		}
	}

	if (
		Object.keys(permissionErrors).length > 0 ||
		Object.keys(environmentErrors).length > 0
	) {
		throw new APIError({
			type: "basic",
			name: "Role Error",
			message: "There was an error creating the role.",
			status: 500,
			errors: modelErrors({
				permissions: permissionErrors,
				environments: environmentErrors,
			}),
		});
	}

	return validPermissions;
};

export default validatePermissions;
