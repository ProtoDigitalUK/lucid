// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Category from "@db/models/Category";
// Schema
import categorySchema from "@schemas/categories";

// --------------------------------------------------
// Controller
const deleteSingle: Controller<
  typeof categorySchema.deleteSingle.params,
  typeof categorySchema.deleteSingle.body,
  typeof categorySchema.deleteSingle.query
> = async (req, res, next) => {
  try {
    const category = await Category.delete(parseInt(req.params.id), req);

    res.status(200).json(
      buildResponse(req, {
        data: category,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: categorySchema.deleteSingle,
  controller: deleteSingle,
};
