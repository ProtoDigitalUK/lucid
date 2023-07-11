"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const UserRole_1 = __importDefault(require("../../db/models/UserRole"));
const users_1 = __importDefault(require("../users"));
const roles_1 = __importDefault(require("../roles"));
const updateRoles = async (data) => {
    const userRoles = await users_1.default.getAllRoles({
        user_id: data.user_id,
    });
    const newRoles = data.role_ids.filter((role) => {
        return !userRoles.find((userRole) => userRole.role_id === role);
    });
    if (newRoles.length > 0) {
        const rolesRes = await roles_1.default.getMultiple({
            query: {
                filter: {
                    role_ids: newRoles.map((role) => role.toString()),
                },
            },
        });
        if (rolesRes.count !== newRoles.length) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Role Error",
                message: "One or more of the roles do not exist.",
                status: 500,
            });
        }
        await UserRole_1.default.updateRoles(data.user_id, {
            role_ids: newRoles,
        });
    }
    const rolesToRemove = userRoles.filter((userRole) => {
        return !data.role_ids.find((role) => role === userRole.role_id);
    });
    if (rolesToRemove.length > 0) {
        const rolesToRemoveIds = rolesToRemove.map((role) => role.id);
        await UserRole_1.default.deleteMultiple(data.user_id, rolesToRemoveIds);
    }
    const updatedUserRoles = await users_1.default.getAllRoles({
        user_id: data.user_id,
    });
    return updatedUserRoles;
};
exports.default = updateRoles;
//# sourceMappingURL=update-roles.js.map