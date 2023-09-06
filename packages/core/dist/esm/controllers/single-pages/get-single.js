import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import singlePageSchema from "../../schemas/single-page.js";
import singlePagesService from "../../services/single-pages/index.js";
const getSingleController = async (req, res, next) => {
    try {
        const singlepage = await service(singlePagesService.getSingle, true)({
            user_id: req.auth.id,
            environment_key: req.headers["lucid-environment"],
            collection_key: req.params.collection_key,
            include_bricks: true,
        });
        res.status(200).json(buildResponse(req, {
            data: singlepage,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: singlePageSchema.getSingle,
    controller: getSingleController,
};
//# sourceMappingURL=get-single.js.map