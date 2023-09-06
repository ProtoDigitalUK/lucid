"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RolePermission_js_1 = __importDefault(require("../../db/models/RolePermission.js"));
const deleteMultiple = async (client, data) => {
    const permissionsPromise = data.ids.map((id) => {
        return RolePermission_js_1.default.deleteSingle(client, {
            id: id,
        });
    });
    const permissions = await Promise.all(permissionsPromise);
    return permissions;
};
exports.default = deleteMultiple;
//# sourceMappingURL=delete-multiple.js.map