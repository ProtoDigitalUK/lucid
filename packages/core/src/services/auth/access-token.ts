import T from "../../translations/index.js";
import type { FastifyRequest, FastifyReply } from "fastify";
import constants from "../../constants.js";
import jwt from "jsonwebtoken";
import LucidServices from "../index.js";
import { LucidAPIError } from "../../utils/error-handler.js";

// TODO: make all functions here use service wrapper and ServiceFn - seperate into own file in access token directory

const key = "_access";

export const generateAccessToken = async (
	reply: FastifyReply,
	request: FastifyRequest,
	userId: number,
) => {
	try {
		const user = await LucidServices.user.getSingle(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				userId: userId,
			},
		);
		if (user.error) throw new LucidAPIError(user.error);

		const payload = {
			id: user.data.id,
			username: user.data.username,
			email: user.data.email,
			permissions: user.data.permissions,
			superAdmin: user.data.superAdmin ?? 0,
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
			secure: request.protocol === "https",
			sameSite: "strict",
			path: "/",
		});
	} catch (err) {
		throw new LucidAPIError({
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
