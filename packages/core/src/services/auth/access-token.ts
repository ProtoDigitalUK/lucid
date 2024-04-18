import T from "../../translations/index.js";
import type { FastifyRequest, FastifyReply } from "fastify";
import constants from "../../constants.js";
import jwt from "jsonwebtoken";
import usersServices from "../users/index.js";
import { HeadlessAPIError } from "../../utils/error-handler.js";

const key = "_access";

export const generateAccessToken = async (
	reply: FastifyReply,
	request: FastifyRequest,
	userId: number,
) => {
	try {
		const user = await usersServices.getSingle(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				userId: userId,
			},
		);

		const payload = {
			id: user.id,
			username: user.username,
			email: user.email,
			permissions: user.permissions,
			superAdmin: user.superAdmin || 0,
		} satisfies FastifyRequest["auth"];

		const token = jwt.sign(
			payload,
			request.server.config.keys.accessTokenSecret,
			{
				expiresIn: constants.accessTokenExpiration,
			},
		);

		reply.setCookie(key, token, {
			maxAge: constants.accessTokenExpiration,
			httpOnly: true,
			secure: request.server.config.mode === "production",
			sameSite: "strict",
			path: "/",
		});
	} catch (err) {
		throw new HeadlessAPIError({
			type: "authorisation",
			name: T("access_token_error_name"),
			message: T("access_token_error_message"),
			status: 401,
		});
	}
};

export const verifyAccessToken = async (request: FastifyRequest) => {
	try {
		const _access = request.cookies[key];

		if (!_access) {
			return {
				success: false,
				data: null,
			};
		}

		const decode = jwt.verify(
			_access,
			request.server.config.keys.accessTokenSecret,
		) as FastifyRequest["auth"];

		return {
			success: true,
			data: decode,
		};
	} catch (err) {
		return {
			success: false,
			data: null,
		};
	}
};

export const clearAccessToken = (reply: FastifyReply) => {
	reply.clearCookie(key, { path: "/" });
};

export default {
	generateAccessToken,
	verifyAccessToken,
	clearAccessToken,
};
