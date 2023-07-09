"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = void 0;
const RolePermission_1 = __importDefault(require("../../db/models/RolePermission"));
const getAll = async (data) => {
    return RolePermission_1.default.getValidPermissions;
};
exports.getAll = getAll;
exports.default = exports.getAll;
//# sourceMappingURL=get-all.js.map