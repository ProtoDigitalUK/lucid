// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import categorySchema from "@schemas/categories";
// Services
import categories from "@services/categories";

// --------------------------------------------------
// Controller
const createSingleControllers: Controller<
  typeof categorySchema.createSingle.params,
  typeof categorySchema.createSingle.body,
  typeof categorySchema.createSingle.query
> = async (req, res, next) => {
  try {
    const category = await categories.createSingle({
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
  controller: createSingleControllers,
};
