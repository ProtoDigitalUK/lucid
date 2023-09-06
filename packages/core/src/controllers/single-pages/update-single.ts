// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import singlePageSchema from "@schemas/single-page.js";
// Services
import singlePagesService from "@services/single-pages/index.js";

// --------------------------------------------------
// Controller
const updateSingleController: Controller<
  typeof singlePageSchema.updateSingle.params,
  typeof singlePageSchema.updateSingle.body,
  typeof singlePageSchema.updateSingle.query
> = async (req, res, next) => {
  try {
    const singlepage = await service(
      singlePagesService.updateSingle,
      true
    )({
      user_id: req.auth.id,
      environment_key: req.headers["lucid-environment"] as string,
      collection_key: req.params.collection_key,
      builder_bricks: req.body.builder_bricks,
      fixed_bricks: req.body.fixed_bricks,
    });

    res.status(200).json(
      buildResponse(req, {
        data: singlepage,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: singlePageSchema.updateSingle,
  controller: updateSingleController,
};
