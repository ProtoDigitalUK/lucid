"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RolePermission_1 = __importDefault(require("../../db/models/RolePermission"));
const getAll = async (client, data) => {
    const rolePermissions = await RolePermission_1.default.getAll(client, {
        role_id: data.role_id,
    });
    return rolePermissions;
};
exports.default = getAll;
//# sourceMappingURL=get-all.js.map