import constants from "../../../constants/constants.js";
import type { ServiceResponse } from "../../../utils/services/types.js";
import type { FastifyReply } from "fastify";

const clearToken = (
	reply: FastifyReply,
): Awaited<ServiceResponse<undefined>> => {
	reply.clearCookie(constants.accessTokenKey, { path: "/" });
	return {
		error: undefined,
		data: undefined,
	};
};

export default clearToken;
