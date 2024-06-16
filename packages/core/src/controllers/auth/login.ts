import T from "../../translations/index.js";
import authSchema from "../../schemas/auth.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import LucidServices from "../../services/index.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import type { RouteController } from "../../types/types.js";

const loginController: RouteController<
	typeof authSchema.login.params,
	typeof authSchema.login.body,
	typeof authSchema.login.query
> = async (request, reply) => {
	const user = await serviceWrapper(LucidServices.auth.login, {
		transaction: false,
		defaultError: {
			type: "basic",
			name: T("default_error_name"),
			message: T("default_error_message"),
			code: "login",
			status: 500,
		},
	})(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			usernameOrEmail: request.body.usernameOrEmail,
			password: request.body.password,
		},
	);
	if (user.error) throw new LucidAPIError(user.error);

	await Promise.all([
		LucidServices.auth.refreshToken.generateRefreshToken(
			reply,
			request,
			user.data.id,
		),
		LucidServices.auth.accessToken.generateAccessToken(
			reply,
			request,
			user.data.id,
		),
	]);

	reply.status(204).send();
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
