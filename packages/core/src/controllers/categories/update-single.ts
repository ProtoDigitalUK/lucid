// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Category from "@db/models/Category";
// Schema
import categorySchema from "@schemas/categories";

// --------------------------------------------------
// Controller
const updateSingle: Controller<
  typeof categorySchema.updateSingle.params,
  typeof categorySchema.updateSingle.body,
  typeof categorySchema.updateSingle.query
> = async (req, res, next) => {
  try {
    const category = await Category.update(
      parseInt(req.params.id),
      {
        title: req.body.title,
        slug: req.body.slug,
        description: req.body.description,
      },
      req
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
  schema: categorySchema.updateSingle,
  controller: updateSingle,
};
