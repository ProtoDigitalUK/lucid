// Utils
import buildResponse from "@utils/controllers/build-response";
// Models
import Category from "@db/models/Category";
// Schema
import categorySchema from "@schemas/categories";

// --------------------------------------------------
// Controller
const getMultiple: Controller<
  typeof categorySchema.getMultiple.params,
  typeof categorySchema.getMultiple.body,
  typeof categorySchema.getMultiple.query
> = async (req, res, next) => {
  try {
    const categories = await Category.getMultiple(
      req.headers["lucid-environment"] as string,
      req.query
    );

    res.status(200).json(
      buildResponse(req, {
        data: categories.data,
        pagination: {
          count: categories.count,
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
  controller: getMultiple,
};
