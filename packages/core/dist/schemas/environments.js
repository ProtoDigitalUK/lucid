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
    assigned_bricks: zod_1.default.array(zod_1.default.string()).optional(),
    assigned_collections: zod_1.default.array(zod_1.default.string()).optional(),
});
const updateSingleQuery = zod_1.default.object({});
const updateSingleParams = zod_1.default.object({
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
};
//# sourceMappingURL=environments.js.map