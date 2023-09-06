"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrickSchema = exports.FieldSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const index_js_1 = require("../builders/brick-builder/index.js");
const FieldTypesSchema = zod_1.default.nativeEnum(index_js_1.FieldTypesEnum);
const baseFieldSchema = zod_1.default.object({
    fields_id: zod_1.default.number().optional(),
    parent_repeater: zod_1.default.number().optional(),
    group_position: zod_1.default.number().optional(),
    key: zod_1.default.string(),
    type: FieldTypesSchema,
    value: zod_1.default.any(),
    target: zod_1.default.any().optional(),
});
exports.FieldSchema = baseFieldSchema.extend({
    items: zod_1.default.lazy(() => exports.FieldSchema.array().optional()),
});
exports.BrickSchema = zod_1.default.object({
    id: zod_1.default.number().optional(),
    key: zod_1.default.string(),
    fields: zod_1.default.array(exports.FieldSchema).optional(),
});
const getAllConfigBody = zod_1.default.object({});
const getAllConfigQuery = zod_1.default.object({
    include: zod_1.default.array(zod_1.default.enum(["fields"])).optional(),
    filter: zod_1.default
        .object({
        collection_key: zod_1.default.string().optional(),
        environment_key: zod_1.default.string().optional(),
    })
        .optional()
        .refine((data) => (data?.collection_key && data?.environment_key) ||
        (!data?.collection_key && !data?.environment_key), {
        message: "Both collection_key and environment_key should be set or neither.",
        path: [],
    }),
});
const getAllConfigParams = zod_1.default.object({});
const getSingleConfigBody = zod_1.default.object({});
const getSingleConfigQuery = zod_1.default.object({});
const getSingleConfigParams = zod_1.default.object({
    brick_key: zod_1.default.string().nonempty(),
});
exports.default = {
    config: {
        getAll: {
            body: getAllConfigBody,
            query: getAllConfigQuery,
            params: getAllConfigParams,
        },
        getSingle: {
            body: getSingleConfigBody,
            query: getSingleConfigQuery,
            params: getSingleConfigParams,
        },
    },
};
//# sourceMappingURL=bricks.js.map