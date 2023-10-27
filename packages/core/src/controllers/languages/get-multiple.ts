// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import languagesSchema from "@schemas/languages.js";
// Services
import languagesService from "@services/languages/index.js";

// --------------------------------------------------
// Controller
const getMultipleController: Controller<
  typeof languagesSchema.getMultiple.params,
  typeof languagesSchema.getMultiple.body,
  typeof languagesSchema.getMultiple.query
> = async (req, res, next) => {
  try {
    const languagesRes = await service(
      languagesService.getMultiple,
      false
    )({
      query: req.query,
    });

    res.status(200).json(
      buildResponse(req, {
        data: languagesRes.data,
        pagination: {
          count: languagesRes.count,
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
  schema: languagesSchema.getMultiple,
  controller: getMultipleController,
};
