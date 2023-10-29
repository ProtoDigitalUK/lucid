// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import pagesSchema from "@schemas/pages.js";
// Services
import pagesService from "@services/pages/index.js";

// --------------------------------------------------
// Controller
const createSingleController: Controller<
  typeof pagesSchema.createSingle.params,
  typeof pagesSchema.createSingle.body,
  typeof pagesSchema.createSingle.query
> = async (req, res, next) => {
  try {
    const page = await service(
      pagesService.createSingle,
      false
    )({
      environment_key: req.headers["lucid-environment"] as string,
      collection_key: req.body.collection_key,
      homepage: req.body.homepage,
      published: req.body.published,
      parent_id: req.body.parent_id,
      category_ids: req.body.category_ids,
      userId: req.auth.id,
      translations: req.body.page_content,
    });

    res.status(200).json(
      buildResponse(req, {
        data: page,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: pagesSchema.createSingle,
  controller: createSingleController,
};
