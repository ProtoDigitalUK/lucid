// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import pagesSchema from "@schemas/pages.js";
// Services
import pagesService from "@services/pages/index.js";

// --------------------------------------------------
// Controller
const deleteMultipleController: Controller<
  typeof pagesSchema.deleteMultiple.params,
  typeof pagesSchema.deleteMultiple.body,
  typeof pagesSchema.deleteMultiple.query
> = async (req, res, next) => {
  try {
    const page = await service(
      pagesService.deleteMultiple,
      false
    )({
      ids: req.body.ids,
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
  schema: pagesSchema.deleteMultiple,
  controller: deleteMultipleController,
};
