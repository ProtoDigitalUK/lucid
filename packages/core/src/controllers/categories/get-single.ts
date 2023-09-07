// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import categorySchema from "@schemas/categories.js";
// Services
import categoriesService from "@services/categories/index.js";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof categorySchema.getSingle.params,
  typeof categorySchema.getSingle.body,
  typeof categorySchema.getSingle.query
> = async (req, res, next) => {
  try {
    const category = await service(
      categoriesService.getSingle,
      false
    )({
      environment_key: req.headers["lucid-environment"] as string,
      id: parseInt(req.params.id),
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
  schema: categorySchema.getSingle,
  controller: getSingleController,
};
