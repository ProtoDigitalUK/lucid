// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import pagesSchema from "@schemas/pages.js";
// Services
import collectionBricksService from "@services/collection-bricks/index.js";

// --------------------------------------------------
// Controller
const updateSingleBricksController: Controller<
  typeof pagesSchema.updateSingleBricks.params,
  typeof pagesSchema.updateSingleBricks.body,
  typeof pagesSchema.updateSingleBricks.query
> = async (req, res, next) => {
  try {
    const bricks = await service(
      collectionBricksService.newF.updateMultiple,
      true
    )({
      id: parseInt(req.params.id),
      type: "pages",
      environment_key: req.headers["lucid-environment"] as string,
      collection_key: req.params.collection_key,
      bricks: req.body.bricks,
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
  schema: pagesSchema.updateSingleBricks,
  controller: updateSingleBricksController,
};
