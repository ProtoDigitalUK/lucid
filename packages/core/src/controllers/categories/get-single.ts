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
> = async (request, reply) => {
  const category = await service(
    categoriesService.getSingle,
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
  schema: categorySchema.getSingle,
  controller: getSingleController,
};
