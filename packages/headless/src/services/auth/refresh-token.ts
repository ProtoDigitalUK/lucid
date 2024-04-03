import T from "../../translations/index.js";
import type { FastifyRequest, FastifyReply } from "fastify";
import constants from "../../constants.js";
import jwt from "jsonwebtoken";
import { APIError } from "../../utils/error-handler.js";
import auth from "./index.js";
import RepositoryFactory from "../../libs/factories/repository-factory.js";

const key = "_refresh";

export const generateRefreshToken = async (
	reply: FastifyReply,
	request: FastifyRequest,
	user_id: number,
) => {
	await clearRefreshToken(request, reply);
	const UserTokensRepo = RepositoryFactory.getRepository(
		"user-tokens",
		request.server.config.db.client,
	);

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

	await UserTokensRepo.createSingle({
		userId: user_id,
		token: token,
		tokenType: "refresh",
		expiryDate: new Date(
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

		if (!_refresh) {
			throw new Error("No refresh token found");
		}

		const UserTokensRepo = RepositoryFactory.getRepository(
			"user-tokens",
			request.server.config.db.client,
		);

		const decode = jwt.verify(
			_refresh,
			request.server.config.keys.refreshTokenSecret,
		) as {
			id: number;
		};

		const token = await UserTokensRepo.selectSingle({
			select: ["id", "user_id"],
			where: [
				{
					key: "token",
					operator: "=",
					value: _refresh,
				},
				{
					key: "token_type",
					operator: "=",
					value: "refresh",
				},
				{
					key: "user_id",
					operator: "=",
					value: decode.id,
				},
				{
					key: "expiry_date",
					operator: ">",
					value: new Date().toISOString(),
				},
			],
		});

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

	const UserTokensRepo = RepositoryFactory.getRepository(
		"user-tokens",
		request.server.config.db.client,
	);

	const decode = jwt.verify(
		_refresh,
		request.server.config.keys.refreshTokenSecret,
	) as {
		id: number;
	};

	reply.clearCookie(key, { path: "/" });

	await UserTokensRepo.deleteMultiple({
		where: [
			{
				key: "token",
				operator: "=",
				value: _refresh,
			},
			{
				key: "token_type",
				operator: "=",
				value: "refresh",
			},
			{
				key: "user_id",
				operator: "=",
				value: decode.id,
			},
		],
	});
};

export default {
	generateRefreshToken,
	verifyRefreshToken,
	clearRefreshToken,
};
