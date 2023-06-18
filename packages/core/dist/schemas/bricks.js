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
const getAllBody = zod_1.default.object({});
const getAllQuery = zod_1.default.object({
    include: zod_1.default.array(zod_1.default.enum(["fields"])).optional(),
    filter: zod_1.default
        .object({
        s: zod_1.default.string().optional(),
        collection_key: zod_1.default.union([zod_1.default.string(), zod_1.default.array(zod_1.default.string())]).optional(),
        environment_key: zod_1.default.string().optional(),
    })
        .optional(),
    sort: zod_1.default
        .array(zod_1.default.object({
        key: zod_1.default.enum(["name"]),
        value: zod_1.default.enum(["asc", "desc"]),
    }))
        .optional(),
});
const getAllParams = zod_1.default.object({});
const getSingleBody = zod_1.default.object({});
const getSingleQuery = zod_1.default.object({});
const getSingleParams = zod_1.default.object({
    key: zod_1.default.string().nonempty(),
});
exports.default = {
    getAll: {
        body: getAllBody,
        query: getAllQuery,
        params: getAllParams,
    },
    getSingle: {
        body: getSingleBody,
        query: getSingleQuery,
        params: getSingleParams,
    },
};
//# sourceMappingURL=bricks.js.map