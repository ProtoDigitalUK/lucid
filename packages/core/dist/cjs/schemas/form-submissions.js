"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const getSingleBody = zod_1.default.object({});
const getSingleQuery = zod_1.default.object({});
const getSingleParams = zod_1.default.object({
    id: zod_1.default.string(),
    form_key: zod_1.default.string(),
});
const deleteSingleBody = zod_1.default.object({});
const deleteSingleQuery = zod_1.default.object({});
const deleteSingleParams = zod_1.default.object({
    id: zod_1.default.string(),
    form_key: zod_1.default.string(),
});
const getMultipleBody = zod_1.default.object({});
const getMultipleQuery = zod_1.default.object({
    sort: zod_1.default
        .array(zod_1.default.object({
        key: zod_1.default.enum(["created_at", "updated_at", "read_at"]),
        value: zod_1.default.enum(["asc", "desc"]),
    }))
        .optional(),
    include: zod_1.default.array(zod_1.default.enum(["fields"])).optional(),
    page: zod_1.default.string().optional(),
    per_page: zod_1.default.string().optional(),
});
const getMultipleParams = zod_1.default.object({
    form_key: zod_1.default.string(),
});
const toggleReadAtBody = zod_1.default.object({});
const toggleReadAtQuery = zod_1.default.object({});
const toggleReadAtParams = zod_1.default.object({
    id: zod_1.default.string(),
    form_key: zod_1.default.string(),
});
exports.default = {
    getSingle: {
        body: getSingleBody,
        query: getSingleQuery,
        params: getSingleParams,
    },
    getMultiple: {
        body: getMultipleBody,
        query: getMultipleQuery,
        params: getMultipleParams,
    },
    toggleReadAt: {
        body: toggleReadAtBody,
        query: toggleReadAtQuery,
        params: toggleReadAtParams,
    },
    deleteSingle: {
        body: deleteSingleBody,
        query: deleteSingleQuery,
        params: deleteSingleParams,
    },
};
//# sourceMappingURL=form-submissions.js.map