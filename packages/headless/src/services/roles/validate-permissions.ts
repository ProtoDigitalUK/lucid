import T from "../../translations/index.js";
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
	const environmentsRes = await serviceConfig.db
		.selectFrom("headless_environments")
		.select("key")
		.execute();

	const permErrors: Array<{
		key: string;
		type: "permissions" | "environments";
		error: ErrorResultT;
	}> = [];
	const validPerms: Array<{
		permission: PermissionT | EnvironmentPermissionT;
		environmentKey?: string;
	}> = [];

	for (const obj of data.permissionGroups) {
		const envKey = obj.environment_key;
		const currentPermissionSet = envKey
			? permissionSet.environment
			: permissionSet.global;

		for (let i = 0; i < obj.permissions.length; i++) {
			const permission = obj.permissions[i] as
				| PermissionT
				| EnvironmentPermissionT;

			if (!currentPermissionSet.includes(permission)) {
				const findError = permErrors.find(
					(e) => e.key === permission && e.type === "permissions",
				);
				if (!findError) {
					permErrors.push({
						key: permission,
						type: envKey ? "environments" : "permissions",
						error: {
							key: permission,
							code: "invalid",
							message: T(
								"the_permission_is_invalid_against_mesage",
								{
									permission: permission,
									group: envKey ? "environment" : "global",
								},
							),
						},
					});
				}
				continue;
			}

			validPerms.push({
				permission,
				environmentKey: envKey,
			});
		}
	}

	if (permErrors.length > 0) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
				name: T("role"),
			}),
			message: T("creation_error_message", {
				name: T("role").toLowerCase(),
			}),
			status: 500,
			errors: modelErrors({
				permissions: permErrors
					.filter((e) => e.type === "permissions")
					.reduce<ErrorResultT>((acc, e) => {
						acc[e.key] = e.error;
						return acc;
					}, {}),
				environments: permErrors
					.filter((e) => e.type === "environments")
					.reduce<ErrorResultT>((acc, e) => {
						acc[e.key] = e.error;
						return acc;
					}, {}),
			}),
		});
	}

	return validPerms.filter((obj) => {
		const envKey = obj.environmentKey;
		if (!envKey) return true;
		return environmentsRes.some((e) => e.key === envKey);
	});
};

export default validatePermissions;
