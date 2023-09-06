import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import collectionSchema from "../../schemas/collections.js";
import collectionsService from "../../services/collections/index.js";
const getSingleController = async (req, res, next) => {
    try {
        const collectionsRes = await service(collectionsService.getSingle, false)({
            collection_key: req.params.collection_key,
            environment_key: req.headers["lucid-environment"],
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
    schema: collectionSchema.getSingle,
    controller: getSingleController,
};
//# sourceMappingURL=get-single.js.map