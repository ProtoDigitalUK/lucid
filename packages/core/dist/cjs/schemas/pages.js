"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const bricks_js_1 = require("./bricks.js");
const getMultipleBody = zod_1.default.object({});
const getMultipleQuery = zod_1.default.object({
    filter: zod_1.default
        .object({
        collection_key: zod_1.default.union([zod_1.default.string(), zod_1.default.array(zod_1.default.string())]).optional(),
        title: zod_1.default.string().optional(),
        slug: zod_1.default.string().optional(),
        category_id: zod_1.default.union([zod_1.default.string(), zod_1.default.array(zod_1.default.string())]).optional(),
    })
        .optional(),
    sort: zod_1.default
        .array(zod_1.default.object({
        key: zod_1.default.enum(["created_at"]),
        value: zod_1.default.enum(["asc", "desc"]),
    }))
        .optional(),
    page: zod_1.default.string().optional(),
    per_page: zod_1.default.string().optional(),
});
const getMultipleParams = zod_1.default.object({});
const createSingleBody = zod_1.default.object({
    title: zod_1.default.string().min(2),
    slug: zod_1.default.string().min(2).toLowerCase(),
    collection_key: zod_1.default.string(),
    homepage: zod_1.default.boolean().optional(),
    excerpt: zod_1.default.string().optional(),
    published: zod_1.default.boolean().optional(),
    parent_id: zod_1.default.number().optional(),
    category_ids: zod_1.default.array(zod_1.default.number()).optional(),
});
const createSingleQuery = zod_1.default.object({});
const createSingleParams = zod_1.default.object({});
const getSingleBody = zod_1.default.object({});
const getSingleQuery = zod_1.default.object({
    include: zod_1.default.array(zod_1.default.enum(["bricks"])).optional(),
});
const getSingleParams = zod_1.default.object({
    id: zod_1.default.string(),
});
const updateSingleBody = zod_1.default.object({
    title: zod_1.default.string().optional(),
    slug: zod_1.default.string().optional(),
    homepage: zod_1.default.boolean().optional(),
    parent_id: zod_1.default.number().optional(),
    category_ids: zod_1.default.array(zod_1.default.number()).optional(),
    published: zod_1.default.boolean().optional(),
    excerpt: zod_1.default.string().optional(),
    builder_bricks: zod_1.default.array(bricks_js_1.BrickSchema).optional(),
    fixed_bricks: zod_1.default.array(bricks_js_1.BrickSchema).optional(),
});
const updateSingleQuery = zod_1.default.object({});
const updateSingleParams = zod_1.default.object({
    id: zod_1.default.string(),
});
const deleteSingleBody = zod_1.default.object({});
const deleteSingleQuery = zod_1.default.object({});
const deleteSingleParams = zod_1.default.object({
    id: zod_1.default.string(),
});
exports.default = {
    getMultiple: {
        body: getMultipleBody,
        query: getMultipleQuery,
        params: getMultipleParams,
    },
    createSingle: {
        body: createSingleBody,
        query: createSingleQuery,
        params: createSingleParams,
    },
    getSingle: {
        body: getSingleBody,
        query: getSingleQuery,
        params: getSingleParams,
    },
    updateSingle: {
        body: updateSingleBody,
        query: updateSingleQuery,
        params: updateSingleParams,
    },
    deleteSingle: {
        body: deleteSingleBody,
        query: deleteSingleQuery,
        params: deleteSingleParams,
    },
};
//# sourceMappingURL=pages.js.map