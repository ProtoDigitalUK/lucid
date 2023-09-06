import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import categorySchema from "../../schemas/categories.js";
import categoriesService from "../../services/categories/index.js";
const updateSingleController = async (req, res, next) => {
    try {
        const category = await service(categoriesService.updateSingle, true)({
            environment_key: req.headers["lucid-environment"],
            id: parseInt(req.params.id),
            data: {
                title: req.body.title,
                slug: req.body.slug,
                description: req.body.description,
            },
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
    schema: categorySchema.updateSingle,
    controller: updateSingleController,
};
//# sourceMappingURL=update-single.js.map