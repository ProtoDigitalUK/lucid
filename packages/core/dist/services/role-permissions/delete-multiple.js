"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RolePermission_1 = __importDefault(require("../../db/models/RolePermission"));
const deleteMultiple = async (data) => {
    const permissionsPromise = data.ids.map((id) => {
        return RolePermission_1.default.deleteSingle(id);
    });
    const permissions = await Promise.all(permissionsPromise);
    return permissions;
};
exports.default = deleteMultiple;
//# sourceMappingURL=delete-multiple.js.map