import { type FastifyRequest, type FastifyReply } from "fastify";
import getConfig from "../config.js";
import constants from "../../constants.js";
import jwt from "jsonwebtoken";

const key = "_refresh";

export const generateRefreshToken = async (
	reply: FastifyReply,
	user: {
		id: number;
	},
) => {
	const config = await getConfig();

	const payload = {
		id: user.id,
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
};

export const verifyRefreshToken = async (request: FastifyRequest) => {
	try {
		const _refresh = request.cookies[key];
		const config = await getConfig();

		if (!_refresh) {
			return {
				success: false,
				userId: null,
			};
		}

		const decode = jwt.verify(_refresh, config.keys.refreshTokenSecret) as {
			id: number;
		};

		return {
			success: true,
			userId: decode.id,
		};
	} catch (err) {
		return {
			success: false,
			userId: null,
		};
	}
};

export const clearRefreshToken = (reply: FastifyReply) => {
	reply.clearCookie(key, { path: "/" });
};

export default {
	generateRefreshToken,
	verifyRefreshToken,
	clearRefreshToken,
};
