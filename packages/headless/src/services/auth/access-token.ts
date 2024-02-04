import T from "../../translations/index.js";
import { type FastifyRequest, type FastifyReply } from "fastify";
import { eq } from "drizzle-orm";
import getConfig from "../config.js";
import constants from "../../constants.js";
import jwt from "jsonwebtoken";
import { users } from "../../db/schema.js";
import { APIError } from "../../utils/app/error-handler.js";

const key = "_access";

export const generateAccessToken = async (
	reply: FastifyReply,
	request: FastifyRequest,
	user_id: number,
) => {
	const config = await getConfig();

	const userRes = await request.server.db
		.select({
			id: users.id,
			username: users.username,
			email: users.email,
		})
		.from(users)
		.where(eq(users.id, user_id));

	if (userRes.length === 0) {
		throw new APIError({
			type: "authorisation",
			name: T("access_token_error_name"),
			message: T("access_token_error_message"),
			status: 401,
		});
	}

	const user = userRes[0];

	const payload = {
		id: user.id,
		username: user.username,
		email: user.email,
		// TODO: store users permissions in the token
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
			// TODO: store users permissions in the token
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
