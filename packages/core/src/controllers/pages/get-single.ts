// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import pagesSchema from "@schemas/pages.js";
// Services
import pagesService from "@services/pages/index.js";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof pagesSchema.getSingle.params,
  typeof pagesSchema.getSingle.body,
  typeof pagesSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const page = await service(
      pagesService.getSingle,
      false
    )({
      query: req.query,
      environment_key: req.headers["lucid-environment"] as string,
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
  schema: pagesSchema.getSingle,
  controller: getSingleController,
};
