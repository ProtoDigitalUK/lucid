"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRole_1 = __importDefault(require("../../db/models/UserRole"));
const users_1 = __importDefault(require("../users"));
const getPermissions = async (data) => {
    const userPermissions = await UserRole_1.default.getPermissions(data.user_id);
    if (!userPermissions) {
        return {
            roles: [],
            permissions: {
                global: [],
                environments: [],
            },
        };
    }
    return users_1.default.formatPermissions(userPermissions);
};
exports.default = getPermissions;
//# sourceMappingURL=get-permissions.js.map