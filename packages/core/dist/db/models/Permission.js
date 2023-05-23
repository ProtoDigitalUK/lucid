"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("@db/db"));
const error_handler_1 = require("@utils/error-handler");
class Permission {
}
_a = Permission;
Permission.set = async (user_id, role) => {
    const permissions = Permission.rolePermissions(role);
    const [permission] = await (0, db_1.default) `
        SELECT * FROM lucid_permissions WHERE user_id = ${user_id}
        `;
    if (!permission) {
        const [permRes] = await (0, db_1.default) `
        INSERT INTO lucid_permissions (user_id, permissions)
        VALUES (${user_id}, ${permissions}) 
        RETURNING *
        `;
        if (!permRes) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Permission Error",
                message: "There was an error setting the permissions.",
                status: 500,
            });
        }
        return permRes;
    }
    else {
        const [permRes] = await (0, db_1.default) `
        UPDATE lucid_permissions
        SET permissions = ${permissions}
        WHERE user_id = ${user_id} 
        RETURNING *
        `;
        if (!permRes) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Permission Error",
                message: "There was an error setting the permissions.",
                status: 500,
            });
        }
        return permRes;
    }
};
Permission.rolePermissions = (role) => {
    switch (role) {
        case "admin":
            return ["manage_users", "manage_content", "manage_settings"];
        case "editor":
            return ["manage_content"];
        default:
            return [];
    }
};
exports.default = Permission;
//# sourceMappingURL=Permission.js.map