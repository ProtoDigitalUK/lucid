import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import mediaSchema from "../../schemas/media.js";
import mediaService from "../../services/media/index.js";
const updateSingleController = async (req, res, next) => {
    try {
        const media = await service(mediaService.updateSingle, true)({
            id: parseInt(req.params.id),
            data: {
                name: req.body.name,
                alt: req.body.alt,
                files: req.files,
            },
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
    schema: mediaSchema.updateSingle,
    controller: updateSingleController,
};
//# sourceMappingURL=update-single.js.map