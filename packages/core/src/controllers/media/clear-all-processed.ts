// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import mediaSchema from "@schemas/media";
// Services
import processedImagesService from "@services/processed-images";

// --------------------------------------------------
// Controller
const clearAllProcessedController: Controller<
  typeof mediaSchema.clearAllProcessed.params,
  typeof mediaSchema.clearAllProcessed.body,
  typeof mediaSchema.clearAllProcessed.query
> = async (req, res, next) => {
  try {
    await service(processedImagesService.clearAll, false)();

    res.status(200).json(
      buildResponse(req, {
        data: undefined,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: mediaSchema.clearAllProcessed,
  controller: clearAllProcessedController,
};
