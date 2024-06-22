import crypto from "node:crypto";
import constants from "../../../constants/constants.js";
import type { FastifyRequest, FastifyReply } from "fastify";
import type { ServiceResponse } from "../../../utils/services/types.js";

const generateToken = async (
	request: FastifyRequest,
	reply: FastifyReply,
): ServiceResponse<string> => {
	const token = crypto.randomBytes(32).toString("hex");

	reply.setCookie(constants.csrfKey, token, {
		maxAge: constants.csrfExpiration,
		httpOnly: true,
		secure: request.protocol === "https",
		sameSite: "strict",
		path: "/",
	});

	return {
		error: undefined,
		data: token,
	};
};

export default generateToken;
