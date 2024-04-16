import T from "../../translations/index.js";
import authSchema from "../../schemas/auth.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import auth from "../../services/auth/index.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";
import type { RouteController } from "../../types/types.js";

const logoutController: RouteController<
	typeof authSchema.logout.params,
	typeof authSchema.logout.body,
	typeof authSchema.logout.query
> = async (request, reply) => {
	try {
		await Promise.all([
			auth.refreshToken.clearRefreshToken(request, reply),
			auth.accessToken.clearAccessToken(reply),
			auth.csrf.clearCSRFToken(reply),
		]);

		reply.status(204).send();
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("default_error_name"),
			message: T("default_error_message"),
			status: 500,
		});
	}
};

export default {
	controller: logoutController,
	zodSchema: authSchema.logout,
	swaggerSchema: {
		description:
			"Logs out a user by clearing the refresh token and access token, it also clears the CSRF token",
		tags: ["auth"],
		summary: "Logs out a user",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
