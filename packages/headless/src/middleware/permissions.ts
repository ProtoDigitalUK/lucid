import T from "../translations/index.js";
import type { FastifyRequest } from "fastify";
import { APIError } from "../utils/app/error-handler.js";
import type { PermissionT } from "@headless/types/src/permissions.js";

const throwPermissionError = () => {
	throw new APIError({
		type: "basic",
		name: T("dynamic_error_name", {
			name: T("permission"),
		}),
		message: T("you_do_not_have_permission_to_perform_this_action"),
		status: 403,
	});
};

const permissions =
	(permissions: PermissionT[]) => async (request: FastifyRequest) => {
		const payloadPermissions = request.auth.permissions;

		if (request.auth.super_admin) return;
		if (payloadPermissions === undefined) return throwPermissionError();

		if (permissions) {
			for (const permission of permissions) {
				if (!payloadPermissions.includes(permission)) {
					throwPermissionError();
					break;
				}
			}
		}
	};

export default permissions;
