// Utils
import buildResponse from "@utils/app/build-response";
// Schema
import bricksSchema from "@schemas/bricks";
// Services
import brickConfig from "@services/brick-config";

// --------------------------------------------------
// Controller
const getAllController: Controller<
  typeof bricksSchema.config.getAll.params,
  typeof bricksSchema.config.getAll.body,
  typeof bricksSchema.config.getAll.query
> = async (req, res, next) => {
  try {
    const bricks = await brickConfig.getAll({
      query: req.query,
      collection_key: req.params.collection_key,
      environment_key: req.headers["lucid-environment"] as string,
    });

    res.status(200).json(
      buildResponse(req, {
        data: bricks,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: bricksSchema.config.getAll,
  controller: getAllController,
};
