import authSchema from "../../schemas/auth.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import auth from "../../services/auth/index.js";

// --------------------------------------------------
// Controller
const loginController: ControllerT<
	typeof authSchema.login.params,
	typeof authSchema.login.body,
	typeof authSchema.login.query
> = async (request, reply) => {
	const user = await auth.login(request.server, {
		usernameOrEmail: request.body.usernameOrEmail,
		password: request.body.password,
	});

	await Promise.all([
		auth.refreshToken.generateRefreshToken(reply, {
			id: user.id,
		}),
		auth.accessToken.generateAccessToken(reply, {
			id: user.id,
			username: user.username,
			email: user.email,
		}),
	]);

	reply.status(200).send();
};

// --------------------------------------------------
// Export
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
