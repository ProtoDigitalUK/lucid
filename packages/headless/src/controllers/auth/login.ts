import authSchema from "../../schemas/auth.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import auth from "../../services/auth/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

const loginController: ControllerT<
	typeof authSchema.login.params,
	typeof authSchema.login.body,
	typeof authSchema.login.query
> = async (request, reply) => {
	const user = await serviceWrapper(auth.login, false)(
		{
			db: request.server.db,
		},
		{
			username_or_email: request.body.username_or_email,
			password: request.body.password,
		},
	);

	await Promise.all([
		auth.refreshToken.generateRefreshToken(reply, request, user.id),
		auth.accessToken.generateAccessToken(reply, request, user.id),
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
				username_or_email: { type: "string" },
				password: { type: "string" },
			},
			required: ["username_or_email", "password"],
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
