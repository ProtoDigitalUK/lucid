// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import mediaSchema from "@schemas/media.js";
// Services
import processedImagesService from "@services/processed-images/index.js";

// --------------------------------------------------
// Controller
const clearAllProcessedController: Controller<
  typeof mediaSchema.clearAllProcessed.params,
  typeof mediaSchema.clearAllProcessed.body,
  typeof mediaSchema.clearAllProcessed.query
> = async (request, reply) => {
  await service(processedImagesService.clearAll, false)();

  reply.status(200).send(
    buildResponse(request, {
      data: undefined,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: mediaSchema.clearAllProcessed,
  controller: clearAllProcessedController,
};
