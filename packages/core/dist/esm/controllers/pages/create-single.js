import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import pagesSchema from "../../schemas/pages.js";
import pagesService from "../../services/pages/index.js";
const createSingleController = async (req, res, next) => {
    try {
        const page = await service(pagesService.createSingle, true)({
            environment_key: req.headers["lucid-environment"],
            title: req.body.title,
            slug: req.body.slug,
            collection_key: req.body.collection_key,
            homepage: req.body.homepage,
            excerpt: req.body.excerpt,
            published: req.body.published,
            parent_id: req.body.parent_id,
            category_ids: req.body.category_ids,
            userId: req.auth.id,
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
    schema: pagesSchema.createSingle,
    controller: createSingleController,
};
//# sourceMappingURL=create-single.js.map