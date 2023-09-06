"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RolePermission_js_1 = __importDefault(require("../../db/models/RolePermission.js"));
const getAll = async (client, data) => {
    const rolePermissions = await RolePermission_js_1.default.getAll(client, {
        role_id: data.role_id,
    });
    return rolePermissions;
};
exports.default = getAll;
//# sourceMappingURL=get-all.js.map