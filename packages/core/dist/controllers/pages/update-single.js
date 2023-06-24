"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const Page_1 = __importDefault(require("../../db/models/Page"));
const pages_1 = __importDefault(require("../../schemas/pages"));
const updateSingle = async (req, res, next) => {
    try {
        const page = await Page_1.default.update({
            id: req.params.id,
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
        res.status(200).json((0, build_response_1.default)(req, {
            data: page,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: pages_1.default.updateSingle,
    controller: updateSingle,
};
//# sourceMappingURL=update-single.js.map