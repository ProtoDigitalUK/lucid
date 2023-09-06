import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import pagesSchema from "../../schemas/pages.js";
import pagesService from "../../services/pages/index.js";
const getSingleController = async (req, res, next) => {
    try {
        const page = await service(pagesService.getSingle, false)({
            query: req.query,
            environment_key: req.headers["lucid-environment"],
            id: parseInt(req.params.id),
        });
        res.status(200).json(buildResponse(req, {
            data: page,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: pagesSchema.getSingle,
    controller: getSingleController,
};
//# sourceMappingURL=get-single.js.map