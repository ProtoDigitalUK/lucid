// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Category from "@db/models/Category";
// Schema
import categorySchema from "@schemas/categories";

// --------------------------------------------------
// Controller
const getSingle: Controller<
  typeof categorySchema.getSingle.params,
  typeof categorySchema.getSingle.body,
  typeof categorySchema.getSingle.query
> = async (req, res, next) => {
  try {
    const category = await Category.getSingle(
      req.headers["lucid-environment"] as string,
      parseInt(req.params.id)
    );

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
  schema: categorySchema.getSingle,
  controller: getSingle,
};
