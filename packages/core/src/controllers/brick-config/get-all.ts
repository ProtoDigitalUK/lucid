// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import bricksSchema from "@schemas/bricks.js";
// Services
import brickConfigService from "@services/brick-config/index.js";

// --------------------------------------------------
// Controller
const getAllController: Controller<
  typeof bricksSchema.config.getAll.params,
  typeof bricksSchema.config.getAll.body,
  typeof bricksSchema.config.getAll.query
> = async (req, res, next) => {
  try {
    const bricks = await service(
      brickConfigService.getAll,
      false
    )({
      query: req.query,
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
