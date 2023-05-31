"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const Category_1 = __importDefault(require("../../db/models/Category"));
const body = zod_1.default.object({
    post_type_id: zod_1.default.number().int(),
    title: zod_1.default.string(),
    slug: zod_1.default.string().min(2).toLowerCase(),
    description: zod_1.default.string().optional(),
});
const query = zod_1.default.object({});
const params = zod_1.default.object({});
const createSingle = async (req, res, next) => {
    try {
        const category = await Category_1.default.create({
            post_type_id: req.body.post_type_id,
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
        });
        res.status(200).json((0, build_response_1.default)(req, {
            data: category,
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