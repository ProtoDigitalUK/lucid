import T from "../../translations/index.js";
import accountSchema from "../../schemas/account.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import account from "../../services/account/index.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";
import type { RouteController } from "../../types/types.js";

const updateMeController: RouteController<
	typeof accountSchema.updateMe.params,
	typeof accountSchema.updateMe.body,
	typeof accountSchema.updateMe.query
> = async (request, reply) => {
	try {
		await serviceWrapper(account.updateMe, true)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				auth: request.auth,
				firstName: request.body.firstName,
				lastName: request.body.lastName,
				username: request.body.username,
				email: request.body.email,
				roleIds: request.body.roleIds,
			},
		);

		reply.status(204).send();
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				name: T("user"),
				method: T("update"),
			}),
			message: T("update_error_message", {
				name: T("user").toLowerCase(),
			}),
			status: 500,
		});
	}
};

export default {
	controller: updateMeController,
	zodSchema: accountSchema.updateMe,
	swaggerSchema: {
		description:
			"Used to update the current authenticated users information",
		tags: ["account"],
		summary: "Update the authenticated user",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
		body: {
			type: "object",
			properties: {
				firstName: {
					type: "string",
				},
				lastName: {
					type: "string",
				},
				username: {
					type: "string",
				},
				email: {
					type: "string",
				},
				roleIds: {
					type: "array",
					items: {
						type: "number",
					},
				},
			},
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
