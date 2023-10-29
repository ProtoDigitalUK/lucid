// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import pagesSchema from "@schemas/pages.js";
// Services
import pagesService from "@services/pages/index.js";

// --------------------------------------------------
// Controller
const getMultipleValidParentsController: Controller<
  typeof pagesSchema.getMultipleValidParents.params,
  typeof pagesSchema.getMultipleValidParents.body,
  typeof pagesSchema.getMultipleValidParents.query
> = async (req, res, next) => {
  try {
    const pagesRes = await service(
      pagesService.getMultipleValidParents,
      false
    )({
      page_id: Number(req.params.id),
      environment_key: req.headers["lucid-environment"] as string,
      query: req.query,
      language: req.language,
    });

    res.status(200).json(
      buildResponse(req, {
        data: pagesRes.data,
        pagination: {
          count: pagesRes.count,
          page: req.query.page as string,
          per_page: req.query.per_page as string,
        },
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: pagesSchema.getMultipleValidParents,
  controller: getMultipleValidParentsController,
};
