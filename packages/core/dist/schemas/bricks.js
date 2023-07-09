"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrickSchema = exports.FieldSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const brick_builder_1 = require("@lucid/brick-builder");
const FieldTypesSchema = zod_1.default.nativeEnum(brick_builder_1.FieldTypesEnum);
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
});
const getAllConfigParams = zod_1.default.object({
    collection_key: zod_1.default.string().nonempty(),
});
const getSingleConfigBody = zod_1.default.object({});
const getSingleConfigQuery = zod_1.default.object({});
const getSingleConfigParams = zod_1.default.object({
    brick_key: zod_1.default.string().nonempty(),
    collection_key: zod_1.default.string().nonempty(),
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