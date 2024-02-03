import authSchema from "../../schemas/auth.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import auth from "../../services/auth/index.js";

const loginController: ControllerT<
	typeof authSchema.login.params,
	typeof authSchema.login.body,
	typeof authSchema.login.query
> = async (request, reply) => {
	const user = await auth.login(request.server, request.body);

	await Promise.all([
		auth.refreshToken.generateRefreshToken(reply, request, user.id),
		auth.accessToken.generateAccessToken(reply, request, user.id),
	]);

	reply.status(200).send();
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
			200: swaggerResponse({
				type: 200,
				noPropertise: true,
			}),
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
