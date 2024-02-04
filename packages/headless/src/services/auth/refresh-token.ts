import T from "../../translations/index.js";
import { type FastifyRequest, type FastifyReply } from "fastify";
import { eq, and, gte } from "drizzle-orm";
import getConfig from "../config.js";
import constants from "../../constants.js";
import jwt from "jsonwebtoken";
import { userTokens } from "../../db/schema.js";
import { APIError } from "../../utils/app/error-handler.js";
import auth from "./index.js";

const key = "_refresh";

export const generateRefreshToken = async (
	reply: FastifyReply,
	request: FastifyRequest,
	user_id: number,
) => {
	const config = await getConfig();
	await clearRefreshToken(request, reply);

	const payload = {
		id: user_id,
	};

	const token = jwt.sign(payload, config.keys.refreshTokenSecret, {
		expiresIn: constants.refreshTokenExpiration,
	});

	reply.setCookie(key, token, {
		maxAge: constants.refreshTokenExpiration,
		httpOnly: true,
		secure: config.mode === "production",
		sameSite: "strict",
		path: "/",
	});

	await request.server.db.insert(userTokens).values({
		user_id: user_id,
		token: token,
		type: "refresh",
		expires_at: new Date(
			Date.now() + constants.refreshTokenExpiration * 1000, // convert to ms
		).toISOString(),
	});
};

export const verifyRefreshToken = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const _refresh = request.cookies[key];
		const config = await getConfig();

		if (!_refresh) {
			throw new Error("No refresh token found");
		}

		const decode = jwt.verify(_refresh, config.keys.refreshTokenSecret) as {
			id: number;
		};

		const token = await request.server.db
			.select({
				id: userTokens.id,
				user_id: userTokens.user_id,
				token: userTokens.token,
			})
			.from(userTokens)
			.where(
				and(
					eq(userTokens.user_id, decode.id),
					eq(userTokens.token, _refresh),
					eq(userTokens.type, "refresh"),
					gte(userTokens.expires_at, new Date().toISOString()),
				),
			);

		if (token.length === 0) {
			throw new Error("No refresh token found");
		}

		return {
			userId: decode.id,
		};
	} catch (err) {
		await Promise.all([
			clearRefreshToken(request, reply),
			auth.accessToken.clearAccessToken(reply),
		]);
		throw new APIError({
			type: "authorisation",
			name: T("refresh_token_error_name"),
			message: T("refresh_token_error_message"),
			status: 401,
		});
	}
};

export const clearRefreshToken = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const _refresh = request.cookies[key];
	if (!_refresh) return;

	const config = await getConfig();

	const decode = jwt.verify(_refresh, config.keys.refreshTokenSecret) as {
		id: number;
	};

	reply.clearCookie(key, { path: "/" });

	await request.server.db
		.delete(userTokens)
		.where(
			and(
				eq(userTokens.user_id, decode.id),
				eq(userTokens.token, _refresh),
				eq(userTokens.type, "refresh"),
			),
		);
};

export default {
	generateRefreshToken,
	verifyRefreshToken,
	clearRefreshToken,
};
