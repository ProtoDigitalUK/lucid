// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import pagesSchema from "@schemas/pages.js";
// Services
import pagesService from "@services/pages/index.js";

// --------------------------------------------------
// Controller
const getMultipleController: Controller<
  typeof pagesSchema.getMultiple.params,
  typeof pagesSchema.getMultiple.body,
  typeof pagesSchema.getMultiple.query
> = async (request, reply) => {
  const pagesRes = await service(
    pagesService.getMultiple,
    false
  )({
    query: request.query,
    environment_key: request.headers["headless-environment"] as string,
    language: request.language,
  });

  reply.status(200).send(
    buildResponse(request, {
      data: pagesRes.data,
      pagination: {
        count: pagesRes.count,
        page: request.query.page as string,
        per_page: request.query.per_page as string,
      },
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: pagesSchema.getMultiple,
  controller: getMultipleController,
};
