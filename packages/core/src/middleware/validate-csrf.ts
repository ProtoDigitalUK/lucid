import lucidServices from "../services/index.js";
import { LucidAPIError } from "../utils/errors/index.js";
import type { FastifyRequest } from "fastify";

const validateCSRF = async (request: FastifyRequest) => {
	const verifyCSRFRes = lucidServices.auth.csrf.verifyToken(request);
	if (verifyCSRFRes.error) throw new LucidAPIError(verifyCSRFRes.error);
};

export default validateCSRF;
