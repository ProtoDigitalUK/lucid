import T from "../../translations/index.js";
import {
	APIError,
	type ErrorResultT,
	modelErrors,
} from "../../utils/app/error-handler.js";
import getPermissions from "../permissions.js";
import { type PermissionT } from "@headless/types/src/permissions.js";

export interface ServiceData {
	permissions: string[];
}

const validatePermissions = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.permissions.length === 0) return [];

	const permissions = getPermissions();

	const permErrors: Array<{
		key: string;
		error: ErrorResultT;
	}> = [];
	const validPerms: Array<{
		permission: PermissionT;
	}> = [];

	for (let i = 0; i < data.permissions.length; i++) {
		const permission = data.permissions[i] as PermissionT;

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
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("role"),
			}),
			message: T("creation_error_message", {
				name: T("role").toLowerCase(),
			}),
			status: 500,
			errors: modelErrors({
				permissions: permErrors.reduce<ErrorResultT>((acc, e) => {
					acc[e.key] = e.error;
					return acc;
				}, {}),
			}),
		});
	}

	return validPerms;
};

export default validatePermissions;
