"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const Page_1 = __importDefault(require("../../db/models/Page"));
const pages_1 = __importDefault(require("../../schemas/pages"));
const createSingle = async (req, res, next) => {
    try {
        const page = await Page_1.default.create({
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
        res.status(200).json((0, build_response_1.default)(req, {
            data: page,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: pages_1.default.createSingle,
    controller: createSingle,
};
//# sourceMappingURL=create-single.js.map