"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RolePermission_js_1 = __importDefault(require("../../db/models/RolePermission.js"));
const deleteAll = async (client, data) => {
    const permissions = await RolePermission_js_1.default.deleteAll(client, {
        role_id: data.role_id,
    });
    return permissions;
};
exports.default = deleteAll;
//# sourceMappingURL=delete-all.js.map