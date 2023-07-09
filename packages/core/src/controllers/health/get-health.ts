// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import healthSchema from "@schemas/health";
// Serives
import getHealth from "@services/health/get-health";

// --------------------------------------------------
// Controller
const getHealthController: Controller<
  typeof healthSchema.getHealth.params,
  typeof healthSchema.getHealth.body,
  typeof healthSchema.getHealth.query
> = async (req, res, next) => {
  try {
    const health = await getHealth({});

    res.status(200).json(
      buildResponse(req, {
        data: health,
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
