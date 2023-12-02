import { FastifyRequest } from "fastify";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
// Services
import authService from "@services/auth/index.js";

const authoriseCSRF = async (request: FastifyRequest) => {
  const verifyCSRF = authService.csrf.verifyCSRFToken(request);
  if (!verifyCSRF) {
    throw new HeadlessError({
      type: "forbidden",
      code: "csrf",
      message: "You are not authorised to perform this action",
    });
  }
};

export default authoriseCSRF;
