import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import categorySchema from "../../schemas/categories.js";
import categoriesService from "../../services/categories/index.js";
const getMultipleController = async (req, res, next) => {
    try {
        const categoriesRes = await service(categoriesService.getMultiple, false)({
            environment_key: req.headers["lucid-environment"],
            query: req.query,
        });
        res.status(200).json(buildResponse(req, {
            data: categoriesRes.data,
            pagination: {
                count: categoriesRes.count,
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
    schema: categorySchema.getMultiple,
    controller: getMultipleController,
};
//# sourceMappingURL=get-multiple.js.map