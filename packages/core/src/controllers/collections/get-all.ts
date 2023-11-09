// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import collectionSchema from "@schemas/collections.js";
// Serives
import collectionsService from "@services/collections/index.js";

// --------------------------------------------------
// Controller
const getAllController: Controller<
  typeof collectionSchema.getAll.params,
  typeof collectionSchema.getAll.body,
  typeof collectionSchema.getAll.query
> = async (request, reply) => {
  const collectionsRes = await service(
    collectionsService.getAll,
    false
  )({
    query: request.query,
  });

  reply.status(200).send(
    buildResponse(request, {
      data: collectionsRes,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: collectionSchema.getAll,
  controller: getAllController,
};
