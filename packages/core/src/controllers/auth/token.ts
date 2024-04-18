import T from "../../translations/index.js";
import authSchema from "../../schemas/auth.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import auth from "../../services/auth/index.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";
import type { RouteController } from "../../types/types.js";

const tokenController: RouteController<
	typeof authSchema.token.params,
	typeof authSchema.token.body,
	typeof authSchema.token.query
> = async (request, reply) => {
	try {
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
	controller: tokenController,
	zodSchema: authSchema.token,
	swaggerSchema: {
		description:
			"Verifies the refresh token and issues a new access and refresh token.",
		tags: ["auth"],
		summary: "Issues a new access and refresh token.",
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
