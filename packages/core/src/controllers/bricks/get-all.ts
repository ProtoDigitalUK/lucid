// Services
import buildResponse from "@services/controllers/build-response";
// Models
import BrickConfig from "@db/models/BrickConfig";
// Schema
import bricksSchema from "@schemas/bricks";

// --------------------------------------------------
// Controller
const getAll: Controller<
  typeof bricksSchema.getAll.params,
  typeof bricksSchema.getAll.body,
  typeof bricksSchema.getAll.query
> = async (req, res, next) => {
  try {
    const bricks = await BrickConfig.getAll(
      req.query,
      req.headers["lucid-environment"] as string
    );

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
  schema: bricksSchema.getAll,
  controller: getAll,
};
