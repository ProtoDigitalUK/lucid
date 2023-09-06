import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import pagesSchema from "../../schemas/pages.js";
import pagesService from "../../services/pages/index.js";
const updateSingleController = async (req, res, next) => {
    try {
        const page = await service(pagesService.updateSingle, true)({
            id: parseInt(req.params.id),
            environment_key: req.headers["lucid-environment"],
            userId: req.auth.id,
            title: req.body.title,
            slug: req.body.slug,
            homepage: req.body.homepage,
            parent_id: req.body.parent_id,
            category_ids: req.body.category_ids,
            published: req.body.published,
            excerpt: req.body.excerpt,
            builder_bricks: req.body.builder_bricks,
            fixed_bricks: req.body.fixed_bricks,
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
    schema: pagesSchema.updateSingle,
    controller: updateSingleController,
};
//# sourceMappingURL=update-single.js.map