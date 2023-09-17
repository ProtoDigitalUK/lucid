// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import categorySchema from "@schemas/categories.js";
// Services
import categoriesService from "@services/categories/index.js";

// --------------------------------------------------
// Controller
const createSingleControllers: Controller<
  typeof categorySchema.createSingle.params,
  typeof categorySchema.createSingle.body,
  typeof categorySchema.createSingle.query
> = async (req, res, next) => {
  try {
    const category = await service(
      categoriesService.createSingle,
      false
    )({
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
