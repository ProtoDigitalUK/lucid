// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import singlePageSchema from "@schemas/single-page.js";
// Services
import singlePagesService from "@services/single-pages/index.js";

// --------------------------------------------------
// Controller
const updateSingleController: Controller<
  typeof singlePageSchema.updateSingle.params,
  typeof singlePageSchema.updateSingle.body,
  typeof singlePageSchema.updateSingle.query
> = async (request, reply) => {
  const singlepage = await service(
    singlePagesService.updateSingle,
    true
  )({
    user_id: request.auth.id,
    environment_key: request.headers["lucid-environment"] as string,
    collection_key: request.params.collection_key,
    bricks: request.body.bricks,
    language: request.language,
  });

  reply.status(200).send(
    buildResponse(request, {
      data: singlepage,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: singlePageSchema.updateSingle,
  controller: updateSingleController,
};
