import authSchema from "../../schemas/auth.js";
import { swaggerResponse, swaggerHeaders } from "../../utils/swagger/index.js";
import lucidServices from "../../services/index.js";
import { LucidAPIError } from "../../utils/errors/index.js";
import type { RouteController } from "../../types/types.js";

const logoutController: RouteController<
	typeof authSchema.logout.params,
	typeof authSchema.logout.body,
	typeof authSchema.logout.query
> = async (request, reply) => {
	const [clearRefreshRes, clearAccessRes, clearCSRFRes] = await Promise.all([
		lucidServices.auth.refreshToken.clearToken(request, reply),
		lucidServices.auth.accessToken.clearToken(reply),
		lucidServices.auth.csrf.clearToken(reply),
	]);
	if (clearRefreshRes.error) throw new LucidAPIError(clearRefreshRes.error);
	if (clearAccessRes.error) throw new LucidAPIError(clearAccessRes.error);
	if (clearCSRFRes.error) throw new LucidAPIError(clearCSRFRes.error);

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
