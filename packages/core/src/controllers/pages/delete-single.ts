// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import pagesSchema from "@schemas/pages.js";
// Services
import pagesService from "@services/pages/index.js";

// --------------------------------------------------
// Controller
const deleteSingleController: Controller<
  typeof pagesSchema.deleteSingle.params,
  typeof pagesSchema.deleteSingle.body,
  typeof pagesSchema.deleteSingle.query
> = async (req, res, next) => {
  try {
    const page = await service(
      pagesService.deleteSingle,
      false
    )({
      id: parseInt(req.params.id),
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
  schema: pagesSchema.deleteSingle,
  controller: deleteSingleController,
};
