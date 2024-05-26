import type { FastifyRequest, FastifyReply } from "fastify";
import crypto from "node:crypto";
import constants from "../../constants.js";

const key = "_csrf";

export const generateCSRFToken = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const token = crypto.randomBytes(32).toString("hex");

	reply.setCookie(key, token, {
		maxAge: constants.csrfExpiration,
		httpOnly: true,
		secure: request.protocol === "https",
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
