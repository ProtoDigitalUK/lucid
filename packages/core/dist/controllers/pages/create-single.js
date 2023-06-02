"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const Page_1 = __importDefault(require("../../db/models/Page"));
const body = zod_1.default.object({
    title: zod_1.default.string().min(2),
    slug: zod_1.default.string().min(2).toLowerCase(),
    collection_key: zod_1.default.string(),
    homepage: zod_1.default.boolean().optional(),
    excerpt: zod_1.default.string().optional(),
    published: zod_1.default.boolean().optional(),
    parent_id: zod_1.default.number().optional(),
    category_ids: zod_1.default.array(zod_1.default.number()).optional(),
});
const query = zod_1.default.object({});
const params = zod_1.default.object({});
const createSingle = async (req, res, next) => {
    try {
        const page = await Page_1.default.create(req, {
            title: req.body.title,
            slug: req.body.slug,
            collection_key: req.body.collection_key,
            homepage: req.body.homepage,
            excerpt: req.body.excerpt,
            published: req.body.published,
            parent_id: req.body.parent_id,
            category_ids: req.body.category_ids,
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
    schema: {
        body,
        query,
        params,
    },
    controller: createSingle,
};
//# sourceMappingURL=create-single.js.map