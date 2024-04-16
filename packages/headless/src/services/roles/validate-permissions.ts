import T from "../../translations/index.js";
import { HeadlessAPIError } from "../../utils/error-handler.js";
import getPermissions from "../permissions.js";
import type { ErrorResult } from "../../types/errors.js";
import type { Permission } from "../../services/permissions.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	permissions: string[];
}

const validatePermissions = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	if (data.permissions.length === 0) return [];

	const permissions = getPermissions();

	const permErrors: Array<{
		key: string;
		error: ErrorResult;
	}> = [];
	const validPerms: Array<{
		permission: Permission;
	}> = [];

	for (let i = 0; i < data.permissions.length; i++) {
		const permission = data.permissions[i] as Permission;

		if (!permissions.includes(permission)) {
			const findError = permErrors.find((e) => e.key === permission);
			if (!findError) {
				permErrors.push({
					key: permission,
					error: {
						key: permission,
						code: "invalid",
						message: T("the_permission_is_invalid_against_mesage", {
							permission: permission,
						}),
					},
				});
			}
			continue;
		}

		validPerms.push({
			permission,
		});
	}

	if (permErrors.length > 0) {
		throw new HeadlessAPIError({
			type: "basic",
			status: 500,
			errorResponse: {
				body: {
					permissions: permErrors.reduce<ErrorResult>((acc, e) => {
						acc[e.key] = e.error;
						return acc;
					}, {}),
				},
			},
		});
	}

	return validPerms;
};

export default validatePermissions;
