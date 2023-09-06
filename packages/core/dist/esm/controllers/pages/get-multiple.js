import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import pagesSchema from "../../schemas/pages.js";
import pagesService from "../../services/pages/index.js";
const getMultipleController = async (req, res, next) => {
    try {
        const pagesRes = await service(pagesService.getMultiple, false)({
            query: req.query,
            environment_key: req.headers["lucid-environment"],
        });
        res.status(200).json(buildResponse(req, {
            data: pagesRes.data,
            pagination: {
                count: pagesRes.count,
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
    schema: pagesSchema.getMultiple,
    controller: getMultipleController,
};
//# sourceMappingURL=get-multiple.js.map