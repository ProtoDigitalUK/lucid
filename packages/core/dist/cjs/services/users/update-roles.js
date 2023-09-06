"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const UserRole_js_1 = __importDefault(require("../../db/models/UserRole.js"));
const index_js_1 = __importDefault(require("../roles/index.js"));
const updateRoles = async (client, data) => {
    const userRoles = await UserRole_js_1.default.getAll(client, {
        user_id: data.user_id,
    });
    const newRoles = data.role_ids.filter((role) => {
        return !userRoles.find((userRole) => userRole.role_id === role);
    });
    if (newRoles.length > 0) {
        const rolesRes = await (0, service_js_1.default)(index_js_1.default.getMultiple, false, client)({
            query: {
                filter: {
                    role_ids: newRoles.map((role) => role.toString()),
                },
            },
        });
        if (rolesRes.count !== newRoles.length) {
            throw new error_handler_js_1.LucidError({
                type: "basic",
                name: "Role Error",
                message: "One or more of the roles do not exist.",
                status: 500,
            });
        }
        await UserRole_js_1.default.updateRoles(client, {
            user_id: data.user_id,
            role_ids: newRoles,
        });
    }
    const rolesToRemove = userRoles.filter((userRole) => {
        return !data.role_ids.find((role) => role === userRole.role_id);
    });
    if (rolesToRemove.length > 0) {
        const rolesToRemoveIds = rolesToRemove.map((role) => role.id);
        await UserRole_js_1.default.deleteMultiple(client, {
            user_id: data.user_id,
            role_ids: rolesToRemoveIds,
        });
    }
    const updatedUserRoles = await UserRole_js_1.default.getAll(client, {
        user_id: data.user_id,
    });
    return updatedUserRoles;
};
exports.default = updateRoles;
//# sourceMappingURL=update-roles.js.map