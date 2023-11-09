import { FastifyRequest } from "fastify";
import { LucidError, modelErrors } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Services
import environmentsService from "@services/environments/index.js";

// ------------------------------------
// Validate Environment Middleware
const validateEnvironment = async (request: FastifyRequest) => {
  // get the environment from the header
  const environment = request.headers["lucid-environment"];

  if (!environment) {
    throw new LucidError({
      type: "basic",
      name: "Validation Error",
      message: "You must set the Lucid Environment header.",
      status: 400,
      errors: modelErrors({
        "lucid-environment": {
          code: "required",
          message: "You must set the Lucid Environment header.",
        },
      }),
    });
  }

  // check if the environment is valid
  const environmentConfig = await service(environmentsService.getAll, false)();
  const findEnv = environmentConfig.find((env) => env.key === environment);

  if (!findEnv) {
    throw new LucidError({
      type: "basic",
      name: "Validation Error",
      message: "You must set a valid Lucid Environment header.",
      status: 400,
      errors: modelErrors({
        "lucid-environment": {
          code: "required",
          message: "You must set a valid Lucid Environment header.",
        },
      }),
    });
  }
};

export default validateEnvironment;
