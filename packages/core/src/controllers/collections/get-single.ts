// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import collectionSchema from "@schemas/collections.js";
// Services
import collectionsService from "@services/collections/index.js";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof collectionSchema.getSingle.params,
  typeof collectionSchema.getSingle.body,
  typeof collectionSchema.getSingle.query
> = async (request, reply) => {
  const collectionsRes = await service(
    collectionsService.getSingle,
    false
  )({
    collection_key: request.params.collection_key,
    environment_key: request.headers["lucid-environment"] as string,
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
  schema: collectionSchema.getSingle,
  controller: getSingleController,
};
