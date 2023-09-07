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
> = async (req, res, next) => {
  try {
    await service(
      processedImagesService.clearSingle,
      false
    )({
      id: parseInt(req.params.id),
    });

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
  schema: mediaSchema.clearSingleProcessed,
  controller: clearSingleProcessedController,
};
