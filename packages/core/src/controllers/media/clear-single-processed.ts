// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import mediaSchema from "@schemas/media";
// Services
import processedImagesService from "@services/processed-images";

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
      key: req.params.key,
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
