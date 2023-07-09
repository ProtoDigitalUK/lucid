"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRole_1 = __importDefault(require("../../db/models/UserRole"));
const updateRoles = async (data) => {
    const userRoles = await UserRole_1.default.update(data.user_id, {
        role_ids: data.role_ids,
    });
    return userRoles;
};
exports.default = updateRoles;
//# sourceMappingURL=update-roles.js.map