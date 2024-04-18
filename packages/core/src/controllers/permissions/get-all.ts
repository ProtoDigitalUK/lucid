import T from "../../translations/index.js";
import permissionsSchema from "../../schemas/permissions.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import buildResponse from "../../utils/build-response.js";
import { permissionGroups } from "../../services/permissions.js";
import Formatter from "../../libs/formatters/index.js";
import PermissionsFormatter from "../../libs/formatters/permissions.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";
import type { RouteController } from "../../types/types.js";

const getAllController: RouteController<
	typeof permissionsSchema.getAll.params,
	typeof permissionsSchema.getAll.body,
	typeof permissionsSchema.getAll.query
> = async (request, reply) => {
	try {
		const PermissionsFormatter = Formatter.get("permissions");

		reply.status(200).send(
			await buildResponse(request, {
				data: PermissionsFormatter.formatMultiple({
					permissions: permissionGroups,
				}),
			}),
		);
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				name: T("permission"),
				method: T("fetch"),
			}),
			message: T("default_error_message"),
			status: 500,
		});
	}
};

export default {
	controller: getAllController,
	zodSchema: permissionsSchema.getAll,
	swaggerSchema: {
		description: "Returns a list of all permissions available for users.",
		tags: ["permissions"],
		summary: "Get all permissions",
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "array",
					items: PermissionsFormatter.swagger,
				},
			}),
		},
	},
};
