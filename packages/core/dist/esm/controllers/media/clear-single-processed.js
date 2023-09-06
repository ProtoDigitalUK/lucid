import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import mediaSchema from "../../schemas/media.js";
import processedImagesService from "../../services/processed-images/index.js";
const clearSingleProcessedController = async (req, res, next) => {
    try {
        await service(processedImagesService.clearSingle, false)({
            id: parseInt(req.params.id),
        });
        res.status(200).json(buildResponse(req, {
            data: undefined,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: mediaSchema.clearSingleProcessed,
    controller: clearSingleProcessedController,
};
//# sourceMappingURL=clear-single-processed.js.map