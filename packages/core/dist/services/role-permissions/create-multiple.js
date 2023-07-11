"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RolePermission_1 = __importDefault(require("../../db/models/RolePermission"));
const createMultiple = async (data) => {
    const permissionsPromise = data.permissions.map((permission) => {
        return RolePermission_1.default.createSingle(data.role_id, permission.permission, permission.environment_key);
    });
    return await Promise.all(permissionsPromise);
};
exports.default = createMultiple;
//# sourceMappingURL=create-multiple.js.map