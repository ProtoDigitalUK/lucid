// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import singlePageSchema from "@schemas/single-page.js";
// Services
import singlePagesService from "@services/single-pages/index.js";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof singlePageSchema.getSingle.params,
  typeof singlePageSchema.getSingle.body,
  typeof singlePageSchema.getSingle.query
> = async (request, reply) => {
  const singlepage = await service(
    singlePagesService.getSingle,
    false
  )({
    user_id: request.auth.id,
    environment_key: request.headers["headless-environment"] as string,
    collection_key: request.params.collection_key,
    include_bricks: true,
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
  schema: singlePageSchema.getSingle,
  controller: getSingleController,
};
