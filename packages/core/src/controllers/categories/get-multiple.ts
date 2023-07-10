// Utils
import buildResponse from "@utils/app/build-response";
// Schema
import categorySchema from "@schemas/categories";
// Services
import categories from "@services/categories";

// --------------------------------------------------
// Controller
const getMultipleController: Controller<
  typeof categorySchema.getMultiple.params,
  typeof categorySchema.getMultiple.body,
  typeof categorySchema.getMultiple.query
> = async (req, res, next) => {
  try {
    const categoriesRes = await categories.getMultiple({
      environment_key: req.headers["lucid-environment"] as string,
      query: req.query,
    });

    res.status(200).json(
      buildResponse(req, {
        data: categoriesRes.data,
        pagination: {
          count: categoriesRes.count,
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
  schema: categorySchema.getMultiple,
  controller: getMultipleController,
};
