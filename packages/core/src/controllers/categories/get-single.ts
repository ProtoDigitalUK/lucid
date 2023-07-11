// Utils
import buildResponse from "@utils/app/build-response";
// Schema
import categorySchema from "@schemas/categories";
// Services
import categoriesService from "@services/categories";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof categorySchema.getSingle.params,
  typeof categorySchema.getSingle.body,
  typeof categorySchema.getSingle.query
> = async (req, res, next) => {
  try {
    const category = await categoriesService.getSingle({
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
