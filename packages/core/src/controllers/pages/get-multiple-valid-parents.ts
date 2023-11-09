// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import pagesSchema from "@schemas/pages.js";
// Services
import pagesService from "@services/pages/index.js";

// --------------------------------------------------
// Controller
const getMultipleValidParentsController: Controller<
  typeof pagesSchema.getMultipleValidParents.params,
  typeof pagesSchema.getMultipleValidParents.body,
  typeof pagesSchema.getMultipleValidParents.query
> = async (request, reply) => {
  const pagesRes = await service(
    pagesService.getMultipleValidParents,
    false
  )({
    page_id: Number(request.params.id),
    environment_key: request.headers["lucid-environment"] as string,
    query: request.query,
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
  schema: pagesSchema.getMultipleValidParents,
  controller: getMultipleValidParentsController,
};
