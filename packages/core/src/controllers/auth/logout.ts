import authSchema from "../../schemas/auth.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import auth from "../../services/auth/index.js";
import type { RouteController } from "../../types/types.js";

const logoutController: RouteController<
	typeof authSchema.logout.params,
	typeof authSchema.logout.body,
	typeof authSchema.logout.query
> = async (request, reply) => {
	await Promise.all([
		auth.refreshToken.clearRefreshToken(request, reply),
		auth.accessToken.clearAccessToken(reply),
		auth.csrf.clearCSRFToken(reply),
	]);

	reply.status(204).send();
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
