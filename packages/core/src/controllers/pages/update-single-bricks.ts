// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import pagesSchema from "@schemas/pages.js";
// Services
import collectionBricksService from "@services/collection-bricks/index.js";

// --------------------------------------------------
// Controller
const updateSingleBricksController: Controller<
  typeof pagesSchema.updateSingleBricks.params,
  typeof pagesSchema.updateSingleBricks.body,
  typeof pagesSchema.updateSingleBricks.query
> = async (request, reply) => {
  const page = await service(
    collectionBricksService.updateMultiple,
    true
  )({
    id: parseInt(request.params.id),
    environment_key: request.headers["lucid-environment"] as string,
    collection_key: request.params.collection_key,
    bricks: request.body.bricks,
    type: "pages",
  });

  reply.status(200).send(
    buildResponse(request, {
      data: page,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: pagesSchema.updateSingleBricks,
  controller: updateSingleBricksController,
};
