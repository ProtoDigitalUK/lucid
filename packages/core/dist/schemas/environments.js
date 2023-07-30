"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const getAllBody = zod_1.default.object({});
const getAllQuery = zod_1.default.object({});
const getAllParams = zod_1.default.object({});
const getSingleBody = zod_1.default.object({});
const getSingleQuery = zod_1.default.object({});
const getSingleParams = zod_1.default.object({
    key: zod_1.default.string(),
});
const migrateEnvironmentBody = zod_1.default.object({});
const migrateEnvironmentQuery = zod_1.default.object({});
const migrateEnvironmentParams = zod_1.default.object({
    key: zod_1.default.string(),
});
const updateSingleBody = zod_1.default.object({
    title: zod_1.default.string(),
    assigned_bricks: zod_1.default.array(zod_1.default.string()).optional(),
    assigned_collections: zod_1.default.array(zod_1.default.string()).optional(),
    assigned_forms: zod_1.default.array(zod_1.default.string()).optional(),
});
const updateSingleQuery = zod_1.default.object({});
const updateSingleParams = zod_1.default.object({
    key: zod_1.default.string(),
});
const createSingleBody = zod_1.default.object({
    key: zod_1.default
        .string()
        .min(4)
        .max(64)
        .regex(/^[a-z-]+$/),
    title: zod_1.default.string(),
    assigned_bricks: zod_1.default.array(zod_1.default.string()).optional(),
    assigned_collections: zod_1.default.array(zod_1.default.string()).optional(),
    assigned_forms: zod_1.default.array(zod_1.default.string()).optional(),
});
const createSingleQuery = zod_1.default.object({});
const createSingleParams = zod_1.default.object({});
const deleteSingleBody = zod_1.default.object({});
const deleteSingleQuery = zod_1.default.object({});
const deleteSingleParams = zod_1.default.object({
    key: zod_1.default.string(),
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
    migrateEnvironment: {
        body: migrateEnvironmentBody,
        query: migrateEnvironmentQuery,
        params: migrateEnvironmentParams,
    },
    updateSingle: {
        body: updateSingleBody,
        query: updateSingleQuery,
        params: updateSingleParams,
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
};
//# sourceMappingURL=environments.js.map