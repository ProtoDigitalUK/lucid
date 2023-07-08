// Services
import buildResponse from "@services/controllers/build-response";
// Models
import BrickConfig from "@db/models/BrickConfig";
// Schema
import bricksSchema from "@schemas/bricks";

// --------------------------------------------------
// Controller
const getSingle: Controller<
  typeof bricksSchema.config.getSingle.params,
  typeof bricksSchema.config.getSingle.body,
  typeof bricksSchema.config.getSingle.query
> = async (req, res, next) => {
  try {
    const brick = await BrickConfig.getSingle({
      brick_key: req.params.brick_key,
      collection_key: req.params.collection_key,
      environment_key: req.headers["lucid-environment"] as string,
    });

    res.status(200).json(
      buildResponse(req, {
        data: brick,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: bricksSchema.config.getSingle,
  controller: getSingle,
};
