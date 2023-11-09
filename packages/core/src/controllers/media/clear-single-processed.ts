// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import mediaSchema from "@schemas/media.js";
// Services
import processedImagesService from "@services/processed-images/index.js";

// --------------------------------------------------
// Controller
const clearSingleProcessedController: Controller<
  typeof mediaSchema.clearSingleProcessed.params,
  typeof mediaSchema.clearSingleProcessed.body,
  typeof mediaSchema.clearSingleProcessed.query
> = async (request, reply) => {
  await service(
    processedImagesService.clearSingle,
    false
  )({
    id: parseInt(request.params.id),
  });

  reply.status(200).send(
    buildResponse(request, {
      data: undefined,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: mediaSchema.clearSingleProcessed,
  controller: clearSingleProcessedController,
};
