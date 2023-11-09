// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import categorySchema from "@schemas/categories.js";
// Serives
import categoriesService from "@services/categories/index.js";

// --------------------------------------------------
// Controller
const deleteSingleController: Controller<
  typeof categorySchema.deleteSingle.params,
  typeof categorySchema.deleteSingle.body,
  typeof categorySchema.deleteSingle.query
> = async (request, reply) => {
  const category = await service(
    categoriesService.deleteSingle,
    false
  )({
    environment_key: request.headers["lucid-environment"] as string,
    id: parseInt(request.params.id),
  });

  reply.status(200).send(
    buildResponse(request, {
      data: category,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: categorySchema.deleteSingle,
  controller: deleteSingleController,
};
