// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import pagesSchema from "@schemas/pages.js";
// Services
import pagesService from "@services/pages/index.js";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof pagesSchema.getSingle.params,
  typeof pagesSchema.getSingle.body,
  typeof pagesSchema.getSingle.query
> = async (request, reply) => {
  const page = await service(
    pagesService.getSingle,
    false
  )({
    query: request.query,
    environment_key: request.headers["headless-environment"] as string,
    id: parseInt(request.params.id),
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
  schema: pagesSchema.getSingle,
  controller: getSingleController,
};
