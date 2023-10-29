// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import pagesSchema from "@schemas/pages.js";
// Services
import pagesService from "@services/pages/index.js";

// --------------------------------------------------
// Controller
const updateSingleController: Controller<
  typeof pagesSchema.updateSingle.params,
  typeof pagesSchema.updateSingle.body,
  typeof pagesSchema.updateSingle.query
> = async (req, res, next) => {
  try {
    const page = await service(
      pagesService.updateSingle,
      true
    )({
      id: parseInt(req.params.id),
      environment_key: req.headers["lucid-environment"] as string,

      homepage: req.body.homepage,
      parent_id: req.body.parent_id,
      author_id: req.body.author_id,
      category_ids: req.body.category_ids,
      published: req.body.published,
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
  schema: pagesSchema.updateSingle,
  controller: updateSingleController,
};
