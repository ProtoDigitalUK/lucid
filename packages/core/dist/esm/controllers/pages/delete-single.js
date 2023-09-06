import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import pagesSchema from "../../schemas/pages.js";
import pagesService from "../../services/pages/index.js";
const deleteSingleController = async (req, res, next) => {
    try {
        const page = await service(pagesService.deleteSingle, true)({
            id: parseInt(req.params.id),
            environment_key: req.headers["lucid-environment"],
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
    schema: pagesSchema.deleteSingle,
    controller: deleteSingleController,
};
//# sourceMappingURL=delete-single.js.map