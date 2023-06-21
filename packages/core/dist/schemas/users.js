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
};
//# sourceMappingURL=users.js.map