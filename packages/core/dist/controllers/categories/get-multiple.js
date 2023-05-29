"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const build_response_1 = __importDefault(require("../../services/controllers/build-response"));
const Category_1 = __importDefault(require("../../db/models/Category"));
const body = zod_1.default.object({});
const query = zod_1.default.object({
    filter: zod_1.default
        .object({
        post_type_id: zod_1.default.union([zod_1.default.string(), zod_1.default.array(zod_1.default.string())]).optional(),
        title: zod_1.default.string().optional(),
    })
        .optional(),
    sort: zod_1.default
        .array(zod_1.default.object({
        key: zod_1.default.enum(["title", "created_at"]),
        value: zod_1.default.enum(["asc", "desc"]),
    }))
        .optional(),
    page: zod_1.default.string().optional(),
    per_page: zod_1.default.string().optional(),
});
const params = zod_1.default.object({});
const getMultiple = async (req, res, next) => {
    try {
        const categories = await Category_1.default.getMultiple(req);
        res.status(200).json((0, build_response_1.default)(req, {
            data: categories.data,
            pagination: {
                count: categories.count,
                page: req.query.page,
                per_page: req.query.per_page,
            },
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
    controller: getMultiple,
};
//# sourceMappingURL=get-multiple.js.map