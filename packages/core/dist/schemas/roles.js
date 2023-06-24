"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const createSingleBody = zod_1.default.object({
    name: zod_1.default.string().min(2),
    permission_groups: zod_1.default.array(zod_1.default.object({
        environment_key: zod_1.default.string().optional(),
        permissions: zod_1.default.array(zod_1.default.string()),
    })),
});
const createSingleQuery = zod_1.default.object({});
const createSingleParams = zod_1.default.object({});
const updateSingleBody = zod_1.default.object({
    name: zod_1.default.string().min(2),
    permission_groups: zod_1.default.array(zod_1.default.object({
        environment_key: zod_1.default.string().optional(),
        permissions: zod_1.default.array(zod_1.default.string()),
    })),
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
const getMultipleQuery = zod_1.default.object({
    filter: zod_1.default
        .object({
        name: zod_1.default.string().optional(),
        role_ids: zod_1.default.union([zod_1.default.string(), zod_1.default.array(zod_1.default.string())]).optional(),
    })
        .optional(),
    sort: zod_1.default
        .array(zod_1.default.object({
        key: zod_1.default.enum(["created_at", "name"]),
        value: zod_1.default.enum(["asc", "desc"]),
    }))
        .optional(),
    include: zod_1.default.array(zod_1.default.enum(["permissions"])).optional(),
    page: zod_1.default.string().optional(),
    per_page: zod_1.default.string().optional(),
});
const getMultipleParams = zod_1.default.object({});
const getMultipleBody = zod_1.default.object({});
const getSingleQuery = zod_1.default.object({});
const getSingleParams = zod_1.default.object({
    id: zod_1.default.string(),
});
const getSingleBody = zod_1.default.object({});
exports.default = {
    createSingle: {
        body: createSingleBody,
        query: createSingleQuery,
        params: createSingleParams,
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
};
//# sourceMappingURL=roles.js.map