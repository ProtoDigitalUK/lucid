// Services
import buildResponse from "@services/controllers/build-response";
// Models
import BrickConfig from "@db/models/BrickConfig";
// Schema
import bricksSchema from "@schemas/bricks";

// --------------------------------------------------
// Controller
const getSingle: Controller<
  typeof bricksSchema.getSingle.params,
  typeof bricksSchema.getSingle.body,
  typeof bricksSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const brick = await BrickConfig.getSingle(
      req.params.brick_key,
      req.params.collection_key,
      req.headers["lucid-environment"] as string
    );

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
  schema: bricksSchema.getSingle,
  controller: getSingle,
};
