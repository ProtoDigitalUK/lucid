// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import pagesSchema from "@schemas/pages.js";
// Services
import pagesService from "@services/pages/index.js";

// --------------------------------------------------
// Controller
const deleteSingleController: Controller<
  typeof pagesSchema.deleteSingle.params,
  typeof pagesSchema.deleteSingle.body,
  typeof pagesSchema.deleteSingle.query
> = async (request, reply) => {
  const page = await service(
    pagesService.deleteSingle,
    false
  )({
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
  schema: pagesSchema.deleteSingle,
  controller: deleteSingleController,
};
