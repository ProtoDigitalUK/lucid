// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import languagesSchema from "@schemas/languages.js";
// Services
import languagesService from "@services/languages/index.js";

// --------------------------------------------------
// Controller
const getMultipleController: Controller<
  typeof languagesSchema.getMultiple.params,
  typeof languagesSchema.getMultiple.body,
  typeof languagesSchema.getMultiple.query
> = async (request, reply) => {
  const languagesRes = await service(
    languagesService.getMultiple,
    false
  )({
    query: request.query,
  });

  reply.status(200).send(
    buildResponse(request, {
      data: languagesRes.data,
      pagination: {
        count: languagesRes.count,
        page: request.query.page as string,
        per_page: request.query.per_page as string,
      },
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: languagesSchema.getMultiple,
  controller: getMultipleController,
};
