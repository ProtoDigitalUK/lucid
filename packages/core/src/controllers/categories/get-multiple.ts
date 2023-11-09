// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import categorySchema from "@schemas/categories.js";
// Services
import categoriesService from "@services/categories/index.js";

// --------------------------------------------------
// Controller
const getMultipleController: Controller<
  typeof categorySchema.getMultiple.params,
  typeof categorySchema.getMultiple.body,
  typeof categorySchema.getMultiple.query
> = async (request, reply) => {
  const categoriesRes = await service(
    categoriesService.getMultiple,
    false
  )({
    environment_key: request.headers["lucid-environment"] as string,
    query: request.query,
  });

  reply.status(200).send(
    buildResponse(request, {
      data: categoriesRes.data,
      pagination: {
        count: categoriesRes.count,
        page: request.query.page as string,
        per_page: request.query.per_page as string,
      },
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: categorySchema.getMultiple,
  controller: getMultipleController,
};
