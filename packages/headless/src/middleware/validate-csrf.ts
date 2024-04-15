import T from "../translations/index.js";
import type { FastifyRequest } from "fastify";
import auth from "../services/auth/index.js";
import { HeadlessAPIError } from "../utils/error-handler.js";

const validateCSRF = async (request: FastifyRequest) => {
	const verifyCSRF = auth.csrf.verifyCSRFToken(request);
	if (!verifyCSRF) {
		throw new HeadlessAPIError({
			type: "forbidden",
			code: "csrf",
			message: T("failed_to_validate_csrf_token"),
		});
	}
};

export default validateCSRF;
