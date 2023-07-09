// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import healthSchema from "@schemas/health";

// --------------------------------------------------
// Controller
const getHealth: Controller<
  typeof healthSchema.getHealth.params,
  typeof healthSchema.getHealth.body,
  typeof healthSchema.getHealth.query
> = async (req, res, next) => {
  try {
    res.status(200).json(
      buildResponse(req, {
        data: {
          api: "ok",
          db: "ok",
        },
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
  controller: getHealth,
};
