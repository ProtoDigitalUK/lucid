// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import pagesSchema from "@schemas/pages.js";
// Services
import pagesService from "@services/pages/index.js";

// --------------------------------------------------
// Controller
const deleteMultipleController: Controller<
  typeof pagesSchema.deleteMultiple.params,
  typeof pagesSchema.deleteMultiple.body,
  typeof pagesSchema.deleteMultiple.query
> = async (request, reply) => {
  const page = await service(
    pagesService.deleteMultiple,
    false
  )({
    ids: request.body.ids,
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
  schema: pagesSchema.deleteMultiple,
  controller: deleteMultipleController,
};
