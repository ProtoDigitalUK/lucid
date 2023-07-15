"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const updateSingleBody = zod_1.default.object({});
const updateSingleQuery = zod_1.default.object({});
const updateSingleParams = zod_1.default.object({});
const updateRolesBody = zod_1.default.object({
    role_ids: zod_1.default.array(zod_1.default.number()),
});
const updateRolesQuery = zod_1.default.object({});
const updateRolesParams = zod_1.default.object({
    id: zod_1.default.string(),
});
const createSingleBody = zod_1.default.object({
    email: zod_1.default.string().email(),
    username: zod_1.default.string(),
    password: zod_1.default.string().min(8),
    role_ids: zod_1.default.array(zod_1.default.number()),
    first_name: zod_1.default.string().optional(),
    last_name: zod_1.default.string().optional(),
    super_admin: zod_1.default.boolean().optional(),
});
const createSingleQuery = zod_1.default.object({});
const createSingleParams = zod_1.default.object({});
const deleteSingleBody = zod_1.default.object({});
const deleteSingleQuery = zod_1.default.object({});
const deleteSingleParams = zod_1.default.object({
    id: zod_1.default.string(),
});
const getMultipleBody = zod_1.default.object({});
const getMultipleQuery = zod_1.default.object({
    filter: zod_1.default
        .object({
        first_name: zod_1.default.string().optional(),
        last_name: zod_1.default.string().optional(),
        email: zod_1.default.string().optional(),
        username: zod_1.default.string().optional(),
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
exports.default = {
    updateSingle: {
        body: updateSingleBody,
        query: updateSingleQuery,
        params: updateSingleParams,
    },
    updateRoles: {
        body: updateRolesBody,
        query: updateRolesQuery,
        params: updateRolesParams,
    },
    createSingle: {
        body: createSingleBody,
        query: createSingleQuery,
        params: createSingleParams,
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
};
//# sourceMappingURL=users.js.map