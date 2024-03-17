import { type FastifyRequest, type FastifyReply } from "fastify";
import crypto from "crypto";
import constants from "../../constants.js";
import getConfig from "../config.js";

const key = "_csrf";

export const generateCSRFToken = async (reply: FastifyReply) => {
	const token = crypto.randomBytes(32).toString("hex");
	const config = await getConfig();

	reply.setCookie(key, token, {
		maxAge: constants.csrfExpiration,
		httpOnly: true,
		secure: config.mode === "production",
		sameSite: "strict",
		path: "/",
	});

	return token;
};

export const verifyCSRFToken = (request: FastifyRequest) => {
	const cookieCSRF = request.cookies._csrf;
	const headerCSRF = request.headers._csrf as string;

	if (!cookieCSRF || !headerCSRF) return false;
	if (cookieCSRF !== headerCSRF) return false;

	return true;
};

export const clearCSRFToken = (reply: FastifyReply) => {
	reply.clearCookie(key, { path: "/" });
};

export default {
	generateCSRFToken,
	verifyCSRFToken,
	clearCSRFToken,
};
