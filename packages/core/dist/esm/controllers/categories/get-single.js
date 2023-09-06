import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import categorySchema from "../../schemas/categories.js";
import categoriesService from "../../services/categories/index.js";
const getSingleController = async (req, res, next) => {
    try {
        const category = await service(categoriesService.getSingle, false)({
            environment_key: req.headers["lucid-environment"],
            id: parseInt(req.params.id),
        });
        res.status(200).json(buildResponse(req, {
            data: category,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: categorySchema.getSingle,
    controller: getSingleController,
};
//# sourceMappingURL=get-single.js.map