import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import mediaSchema from "../../schemas/media.js";
import processedImagesService from "../../services/processed-images/index.js";
const clearAllProcessedController = async (req, res, next) => {
    try {
        await service(processedImagesService.clearAll, false)();
        res.status(200).json(buildResponse(req, {
            data: undefined,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: mediaSchema.clearAllProcessed,
    controller: clearAllProcessedController,
};
//# sourceMappingURL=clear-all-processed.js.map