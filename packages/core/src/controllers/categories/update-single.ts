// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import categorySchema from "@schemas/categories";
// Serives
import categoriesService from "@services/categories";

// --------------------------------------------------
// Controller
const updateSingleController: Controller<
  typeof categorySchema.updateSingle.params,
  typeof categorySchema.updateSingle.body,
  typeof categorySchema.updateSingle.query
> = async (req, res, next) => {
  try {
    const category = await service(
      categoriesService.updateSingle,
      true
    )({
      environment_key: req.headers["lucid-environment"] as string,
      id: parseInt(req.params.id),
      data: {
        title: req.body.title,
        slug: req.body.slug,
        description: req.body.description,
      },
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
  schema: categorySchema.updateSingle,
  controller: updateSingleController,
};
