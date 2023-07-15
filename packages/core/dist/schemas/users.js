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
const createUserBody = zod_1.default.object({
    email: zod_1.default.string().email(),
    username: zod_1.default.string(),
    password: zod_1.default.string().min(8),
    role_ids: zod_1.default.array(zod_1.default.number()),
    first_name: zod_1.default.string().optional(),
    last_name: zod_1.default.string().optional(),
    super_admin: zod_1.default.boolean().optional(),
});
const createUserQuery = zod_1.default.object({});
const createUserParams = zod_1.default.object({});
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
    createUser: {
        body: createUserBody,
        query: createUserQuery,
        params: createUserParams,
    },
};
//# sourceMappingURL=users.js.map