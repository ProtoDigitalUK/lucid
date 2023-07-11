// Utils
import buildResponse from "@utils/app/build-response";
// Schema
import healthSchema from "@schemas/health";
// Serives
import healthService from "@services/health";

// --------------------------------------------------
// Controller
const getHealthController: Controller<
  typeof healthSchema.getHealth.params,
  typeof healthSchema.getHealth.body,
  typeof healthSchema.getHealth.query
> = async (req, res, next) => {
  try {
    const healthRes = await healthService.getHealth({});

    res.status(200).json(
      buildResponse(req, {
        data: healthRes,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: healthSchema.getHealth,
  controller: getHealthController,
};
