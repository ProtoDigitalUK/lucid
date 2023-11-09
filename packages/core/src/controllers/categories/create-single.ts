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
> = async (request, reply) => {
  const category = await service(
    categoriesService.createSingle,
    false
  )({
    environment_key: request.headers["lucid-environment"] as string,
    collection_key: request.body.collection_key,
    title: request.body.title,
    slug: request.body.slug,
    description: request.body.description,
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
  schema: categorySchema.createSingle,
  controller: createSingleControllers,
};
