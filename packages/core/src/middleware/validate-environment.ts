import { FastifyRequest } from "fastify";
import { HeadlessError, modelErrors } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Services
import environmentsService from "@services/environments/index.js";

// ------------------------------------
// Validate Environment Middleware
const validateEnvironment = async (request: FastifyRequest) => {
  // get the environment from the header
  const environment = request.headers["headless-environment"];

  if (!environment) {
    throw new HeadlessError({
      type: "basic",
      name: "Validation Error",
      message: "You must set the Headless Environment header.",
      status: 400,
      errors: modelErrors({
        "headless-environment": {
          code: "required",
          message: "You must set the Headless Environment header.",
        },
      }),
    });
  }

  // check if the environment is valid
  const environmentConfig = await service(environmentsService.getAll, false)();
  const findEnv = environmentConfig.find((env) => env.key === environment);

  if (!findEnv) {
    throw new HeadlessError({
      type: "basic",
      name: "Validation Error",
      message: "You must set a valid Headless Environment header.",
      status: 400,
      errors: modelErrors({
        "headless-environment": {
          code: "required",
          message: "You must set a valid Headless Environment header.",
        },
      }),
    });
  }
};

export default validateEnvironment;
