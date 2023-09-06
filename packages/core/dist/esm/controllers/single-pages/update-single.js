import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import singlePageSchema from "../../schemas/single-page.js";
import singlePagesService from "../../services/single-pages/index.js";
const updateSingleController = async (req, res, next) => {
    try {
        const singlepage = await service(singlePagesService.updateSingle, true)({
            user_id: req.auth.id,
            environment_key: req.headers["lucid-environment"],
            collection_key: req.params.collection_key,
            builder_bricks: req.body.builder_bricks,
            fixed_bricks: req.body.fixed_bricks,
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
    schema: singlePageSchema.updateSingle,
    controller: updateSingleController,
};
//# sourceMappingURL=update-single.js.map