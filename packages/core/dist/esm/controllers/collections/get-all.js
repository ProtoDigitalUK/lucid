import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import collectionSchema from "../../schemas/collections.js";
import collectionsService from "../../services/collections/index.js";
const getAllController = async (req, res, next) => {
    try {
        const collectionsRes = await service(collectionsService.getAll, false)({
            query: req.query,
        });
        res.status(200).json(buildResponse(req, {
            data: collectionsRes,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: collectionSchema.getAll,
    controller: getAllController,
};
//# sourceMappingURL=get-all.js.map