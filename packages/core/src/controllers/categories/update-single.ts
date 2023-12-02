// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import categorySchema from "@schemas/categories.js";
// Serives
import categoriesService from "@services/categories/index.js";

// --------------------------------------------------
// Controller
const updateSingleController: Controller<
  typeof categorySchema.updateSingle.params,
  typeof categorySchema.updateSingle.body,
  typeof categorySchema.updateSingle.query
> = async (request, reply) => {
  const category = await service(
    categoriesService.updateSingle,
    false
  )({
    environment_key: request.headers["headless-environment"] as string,
    id: parseInt(request.params.id),
    data: {
      title: request.body.title,
      slug: request.body.slug,
      description: request.body.description,
    },
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
  schema: categorySchema.updateSingle,
  controller: updateSingleController,
};
