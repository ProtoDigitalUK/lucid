// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import pagesSchema from "@schemas/pages.js";
// Services
import pagesService from "@services/pages/index.js";

// --------------------------------------------------
// Controller
const getAllValidParentsController: Controller<
  typeof pagesSchema.getAllValidParents.params,
  typeof pagesSchema.getAllValidParents.body,
  typeof pagesSchema.getAllValidParents.query
> = async (req, res, next) => {
  try {
    const pages = await service(
      pagesService.getAllValidParents,
      false
    )({
      page_id: Number(req.params.id),
      environment_key: req.headers["lucid-environment"] as string,
      collection_key: req.params.collection_key,
    });

    res.status(200).json(
      buildResponse(req, {
        data: pages,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: pagesSchema.getAllValidParents,
  controller: getAllValidParentsController,
};
