// Utils
import buildResponse from "@utils/controllers/build-response";
// Models
import Category from "@db/models/Category";
// Schema
import categorySchema from "@schemas/categories";

// --------------------------------------------------
// Controller
const createSingle: Controller<
  typeof categorySchema.createSingle.params,
  typeof categorySchema.createSingle.body,
  typeof categorySchema.createSingle.query
> = async (req, res, next) => {
  try {
    const category = await Category.create({
      environment_key: req.headers["lucid-environment"] as string,
      collection_key: req.body.collection_key,
      title: req.body.title,
      slug: req.body.slug,
      description: req.body.description,
    });

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
  schema: categorySchema.createSingle,
  controller: createSingle,
};
