// Utils
import buildResponse from "@utils/app/build-response";
// Schema
import categorySchema from "@schemas/categories";
// Serives
import categories from "@services/categories";

// --------------------------------------------------
// Controller
const deleteSingleController: Controller<
  typeof categorySchema.deleteSingle.params,
  typeof categorySchema.deleteSingle.body,
  typeof categorySchema.deleteSingle.query
> = async (req, res, next) => {
  try {
    const category = await categories.deleteSingle({
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
  schema: categorySchema.deleteSingle,
  controller: deleteSingleController,
};
