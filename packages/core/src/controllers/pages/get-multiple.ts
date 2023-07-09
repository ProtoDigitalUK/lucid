// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import pagesSchema from "@schemas/pages";
// Services
import getMultiple from "@services/pages/get-multiple";

// --------------------------------------------------
// Controller
const getMultipleController: Controller<
  typeof pagesSchema.getMultiple.params,
  typeof pagesSchema.getMultiple.body,
  typeof pagesSchema.getMultiple.query
> = async (req, res, next) => {
  try {
    const pages = await getMultiple({
      query: req.query,
      environment_key: req.headers["lucid-environment"] as string,
    });

    res.status(200).json(
      buildResponse(req, {
        data: pages.data,
        pagination: {
          count: pages.count,
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
  schema: pagesSchema.getMultiple,
  controller: getMultipleController,
};
