import { type FastifyRequest, type FastifyReply } from "fastify";
import getConfig from "../config.js";
import constants from "../../constants.js";
import jwt from "jsonwebtoken";

const key = "_access";

export const generateAccessToken = async (
	reply: FastifyReply,
	user: {
		id: number;
		username: string;
		email: string;
	},
) => {
	const config = await getConfig();

	const payload = {
		id: user.id,
		username: user.username,
		email: user.email,
	};

	const token = jwt.sign(payload, config.keys.accessTokenSecret, {
		expiresIn: constants.accessTokenExpiration,
	});

	reply.setCookie(key, token, {
		maxAge: constants.accessTokenExpiration,
		httpOnly: true,
		secure: config.mode === "production",
		sameSite: "strict",
		path: "/",
	});
};

export const verifyAccessToken = async (request: FastifyRequest) => {
	try {
		const _access = request.cookies[key];
		const config = await getConfig();

		if (!_access) {
			return {
				success: false,
				data: null,
			};
		}

		const decode = jwt.verify(_access, config.keys.accessTokenSecret) as {
			id: number;
			username: string;
			email: string;
		};

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
