"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_js_1 = __importDefault(require("../../utils/app/build-response.js"));
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const pages_js_1 = __importDefault(require("../../schemas/pages.js"));
const index_js_1 = __importDefault(require("../../services/pages/index.js"));
const createSingleController = async (req, res, next) => {
    try {
        const page = await (0, service_js_1.default)(index_js_1.default.createSingle, true)({
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
        res.status(200).json((0, build_response_js_1.default)(req, {
            data: page,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: pages_js_1.default.createSingle,
    controller: createSingleController,
};
//# sourceMappingURL=create-single.js.map