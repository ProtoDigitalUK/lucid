import T from "../../../translations/index.js";
import type { FastifyRequest } from "fastify";
import type { ServiceResponse } from "../../../utils/services/types.js";

const verifyToken = (
	request: FastifyRequest,
): Awaited<ServiceResponse<undefined>> => {
	const cookieCSRF = request.cookies._csrf;
	const headerCSRF = request.headers._csrf as string;

	if (!cookieCSRF || !headerCSRF) {
		return {
			error: {
				type: "forbidden",
				code: "csrf",
				message: T("failed_to_validate_csrf_token"),
			},
			data: undefined,
		};
	}
	if (cookieCSRF !== headerCSRF) {
		return {
			error: {
				type: "forbidden",
				code: "csrf",
				message: T("failed_to_validate_csrf_token"),
			},
			data: undefined,
		};
	}

	return {
		error: undefined,
		data: undefined,
	};
};

export default verifyToken;
