// Utils
import buildResponse from "@utils/app/build-response.js";
// Schema
import healthSchema from "@schemas/health.js";
// Serives
import healthService from "@services/health/index.js";

// --------------------------------------------------
// Controller
const getHealthController: Controller<
  typeof healthSchema.getHealth.params,
  typeof healthSchema.getHealth.body,
  typeof healthSchema.getHealth.query
> = async (request, reply) => {
  const healthRes = await healthService.getHealth({});

  reply.status(200).send(
    buildResponse(request, {
      data: healthRes,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: healthSchema.getHealth,
  controller: getHealthController,
};
