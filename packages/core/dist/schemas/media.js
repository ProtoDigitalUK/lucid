"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const createSingleBody = zod_1.default.object({
    name: zod_1.default.string().optional(),
    alt: zod_1.default.string().optional(),
});
const createSingleQuery = zod_1.default.object({});
const createSingleParams = zod_1.default.object({});
const streamSingleBody = zod_1.default.object({});
const streamSingleQuery = zod_1.default.object({});
const streamSingleParams = zod_1.default.object({
    key: zod_1.default.string(),
});
const getMultipleBody = zod_1.default.object({});
const getMultipleQuery = zod_1.default.object({
    filter: zod_1.default
        .object({
        name: zod_1.default.string().optional(),
        key: zod_1.default.string().optional(),
        mime_type: zod_1.default.union([zod_1.default.string(), zod_1.default.array(zod_1.default.string())]).optional(),
        file_extension: zod_1.default.union([zod_1.default.string(), zod_1.default.array(zod_1.default.string())]).optional(),
    })
        .optional(),
    sort: zod_1.default
        .array(zod_1.default.object({
        key: zod_1.default.enum([
            "created_at",
            "updated_at",
            "name",
            "file_size",
            "width",
            "height",
            "mime_type",
            "file_extension",
        ]),
        value: zod_1.default.enum(["asc", "desc"]),
    }))
        .optional(),
    page: zod_1.default.string().optional(),
    per_page: zod_1.default.string().optional(),
});
const getMultipleParams = zod_1.default.object({});
const getSingleBody = zod_1.default.object({});
const getSingleQuery = zod_1.default.object({});
const getSingleParams = zod_1.default.object({
    key: zod_1.default.string(),
});
const deleteSingleBody = zod_1.default.object({});
const deleteSingleQuery = zod_1.default.object({});
const deleteSingleParams = zod_1.default.object({
    key: zod_1.default.string(),
});
const updateSingleBody = zod_1.default.object({
    name: zod_1.default.string().optional(),
    alt: zod_1.default.string().optional(),
});
const updateSingleQuery = zod_1.default.object({});
const updateSingleParams = zod_1.default.object({
    key: zod_1.default.string(),
});
exports.default = {
    createSingle: {
        body: createSingleBody,
        query: createSingleQuery,
        params: createSingleParams,
    },
    streamSingle: {
        body: streamSingleBody,
        query: streamSingleQuery,
        params: streamSingleParams,
    },
    getMultiple: {
        body: getMultipleBody,
        query: getMultipleQuery,
        params: getMultipleParams,
    },
    getSingle: {
        body: getSingleBody,
        query: getSingleQuery,
        params: getSingleParams,
    },
    deleteSingle: {
        body: deleteSingleBody,
        query: deleteSingleQuery,
        params: deleteSingleParams,
    },
    updateSingle: {
        body: updateSingleBody,
        query: updateSingleQuery,
        params: updateSingleParams,
    },
};
//# sourceMappingURL=media.js.map