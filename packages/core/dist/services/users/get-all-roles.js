"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRole_1 = __importDefault(require("../../db/models/UserRole"));
const getAllRoles = async (data) => {
    const userRoles = await UserRole_1.default.getAll(data.user_id);
    return userRoles;
};
exports.default = getAllRoles;
//# sourceMappingURL=get-all-roles.js.map