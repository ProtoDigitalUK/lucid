import authSchema from "../../schemas/auth.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import auth from "../../services/auth/index.js";

const tokenController: ControllerT<
	typeof authSchema.token.params,
	typeof authSchema.token.body,
	typeof authSchema.token.query
> = async (request, reply) => {
	const refreshPayload = await auth.refreshToken.verifyRefreshToken(
		request,
		reply,
	);

	await Promise.all([
		auth.refreshToken.generateRefreshToken(
			reply,
			request,
			refreshPayload.userId as number,
		),
		auth.accessToken.generateAccessToken(
			reply,
			request,
			refreshPayload.userId as number,
		),
	]);

	reply.status(200).send();
};

export default {
	controller: tokenController,
	zodSchema: authSchema.token,
	swaggerSchema: {
		description:
			"Verifies the refresh token and issues a new access and refresh token.",
		tags: ["auth"],
		summary: "Issues a new access and refresh token.",
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
