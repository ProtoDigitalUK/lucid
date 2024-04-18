import T from "../../translations/index.js";
import authSchema from "../../schemas/auth.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import auth from "../../services/auth/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";
import type { RouteController } from "../../types/types.js";

const loginController: RouteController<
	typeof authSchema.login.params,
	typeof authSchema.login.body,
	typeof authSchema.login.query
> = async (request, reply) => {
	try {
		const user = await serviceWrapper(auth.login, false)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				usernameOrEmail: request.body.usernameOrEmail,
				password: request.body.password,
			},
		);

		await Promise.all([
			auth.refreshToken.generateRefreshToken(reply, request, user.id),
			auth.accessToken.generateAccessToken(reply, request, user.id),
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
	controller: loginController,
	zodSchema: authSchema.login,
	swaggerSchema: {
		description:
			"Authenticates a user and sets a refresh and access token as httpOnly cookies.",
		tags: ["auth"],
		summary: "Authenticates a user and sets httpOnly cookies",
		body: {
			type: "object",
			properties: {
				usernameOrEmail: { type: "string" },
				password: { type: "string" },
			},
			required: ["usernameOrEmail", "password"],
		},
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
