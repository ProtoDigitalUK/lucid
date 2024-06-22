import constants from "../../../constants/constants.js";
import type { FastifyReply } from "fastify";
import type { ServiceResponse } from "../../../utils/services/types.js";

const clearToken = (
	reply: FastifyReply,
): Awaited<ServiceResponse<undefined>> => {
	reply.clearCookie(constants.csrfKey, { path: "/" });

	return {
		error: undefined,
		data: undefined,
	};
};

export default clearToken;
