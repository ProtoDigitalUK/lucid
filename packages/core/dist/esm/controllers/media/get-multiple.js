import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import mediaSchema from "../../schemas/media.js";
import mediaService from "../../services/media/index.js";
const getMultipleController = async (req, res, next) => {
    try {
        const mediasRes = await service(mediaService.getMultiple, false)({
            query: req.query,
        });
        res.status(200).json(buildResponse(req, {
            data: mediasRes.data,
            pagination: {
                count: mediasRes.count,
                page: req.query.page,
                per_page: req.query.per_page,
            },
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: mediaSchema.getMultiple,
    controller: getMultipleController,
};
//# sourceMappingURL=get-multiple.js.map