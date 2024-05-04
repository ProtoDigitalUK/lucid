import T from "../translations/index.js";
import type { FastifyRequest } from "fastify";
import { LucidAPIError } from "../utils/error-handler.js";
import type { Permission } from "../types/response.js";

const throwPermissionError = () => {
	throw new LucidAPIError({
		type: "basic",
		name: T("dynamic_error_name", {
			name: T("permission"),
		}),
		message: T("you_do_not_have_permission_to_perform_this_action"),
		status: 403,
	});
};

const permissions =
	(permissions: Permission[]) => async (request: FastifyRequest) => {
		const payloadPermissions = request.auth.permissions;

		if (request.auth.superAdmin) return;
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
