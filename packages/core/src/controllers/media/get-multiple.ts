// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import mediaSchema from "@schemas/media.js";
// Services
import mediaService from "@services/media/index.js";

// --------------------------------------------------
// Controller
const getMultipleController: Controller<
  typeof mediaSchema.getMultiple.params,
  typeof mediaSchema.getMultiple.body,
  typeof mediaSchema.getMultiple.query
> = async (request, reply) => {
  const mediasRes = await service(
    mediaService.getMultiple,
    false
  )({
    query: request.query,
    language: request.language,
  });

  reply.status(200).send(
    buildResponse(request, {
      data: mediasRes.data,
      pagination: {
        count: mediasRes.count,
        page: request.query.page as string,
        per_page: request.query.per_page as string,
      },
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: mediaSchema.getMultiple,
  controller: getMultipleController,
};
