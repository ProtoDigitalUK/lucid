import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import mediaSchema from "../../schemas/media.js";
import mediaService from "../../services/media/index.js";
const getSingleController = async (req, res, next) => {
    try {
        const media = await service(mediaService.getSingle, false)({
            id: parseInt(req.params.id),
        });
        res.status(200).json(buildResponse(req, {
            data: media,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: mediaSchema.getSingle,
    controller: getSingleController,
};
//# sourceMappingURL=get-single.js.map