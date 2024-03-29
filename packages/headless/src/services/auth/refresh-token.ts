import T from "../../translations/index.js";
import type { FastifyRequest, FastifyReply } from "fastify";
import constants from "../../constants.js";
import jwt from "jsonwebtoken";
import { APIError } from "../../utils/error-handler.js";
import auth from "./index.js";

const key = "_refresh";

export const generateRefreshToken = async (
	reply: FastifyReply,
	request: FastifyRequest,
	user_id: number,
) => {
	await clearRefreshToken(request, reply);

	const payload = {
		id: user_id,
	};

	const token = jwt.sign(
		payload,
		request.server.config.keys.refreshTokenSecret,
		{
			expiresIn: constants.refreshTokenExpiration,
		},
	);

	reply.setCookie(key, token, {
		maxAge: constants.refreshTokenExpiration,
		httpOnly: true,
		secure: request.server.config.mode === "production",
		sameSite: "strict",
		path: "/",
	});

	await request.server.config.db.client
		.insertInto("headless_user_tokens")
		.values({
			user_id: user_id,
			token: token,
			token_type: "refresh",
			expiry_date: new Date(
				Date.now() + constants.refreshTokenExpiration * 1000, // convert to ms
			).toISOString(),
		})
		.execute();
};

export const verifyRefreshToken = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const _refresh = request.cookies[key];

		if (!_refresh) {
			throw new Error("No refresh token found");
		}

		const decode = jwt.verify(
			_refresh,
			request.server.config.keys.refreshTokenSecret,
		) as {
			id: number;
		};

		const token = await request.server.config.db.client
			.selectFrom("headless_user_tokens")
			.select("id")
			.where("user_id", "=", decode.id)
			.where("token", "=", _refresh)
			.where("token_type", "=", "refresh")
			.where("expiry_date", ">=", new Date())
			.executeTakeFirst();

		if (token === undefined) {
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

	const decode = jwt.verify(
		_refresh,
		request.server.config.keys.refreshTokenSecret,
	) as {
		id: number;
	};

	reply.clearCookie(key, { path: "/" });

	await request.server.config.db.client
		.deleteFrom("headless_user_tokens")
		.where("user_id", "=", decode.id)
		.where("token", "=", _refresh)
		.where("token_type", "=", "refresh")
		.execute();
};

export default {
	generateRefreshToken,
	verifyRefreshToken,
	clearRefreshToken,
};
