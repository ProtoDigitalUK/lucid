import T from "../translations/index.js";
import { type FastifyRequest } from "fastify";
import { APIError } from "../utils/app/error-handler.js";
import type {
	PermissionT,
	EnvironmentPermissionT,
} from "@headless/types/src/permissions.js";

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
	(permissions: {
		global?: PermissionT[];
		environments?: EnvironmentPermissionT[];
	}) =>
	async (request: FastifyRequest) => {
		const environment = request.headers["headless-environment"];

		const payloadPermissions = request.auth.permissions;

		if (request.auth.super_admin) return;
		if (payloadPermissions === undefined) return throwPermissionError();

		if (permissions.global) {
			for (const permission of permissions.global) {
				if (!payloadPermissions.global.includes(permission)) {
					throwPermissionError();
					break;
				}
			}
		}

		if (permissions.environments) {
			if (!environment) return throwPermissionError();

			const environmentPermissions =
				payloadPermissions.environments?.find(
					(env) => env.key === environment,
				);
			if (!environmentPermissions) return throwPermissionError();

			for (const permission of permissions.environments) {
				if (!environmentPermissions?.permissions.includes(permission))
					throwPermissionError();
			}
		}
	};

export default permissions;
