"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const error_handler_1 = require("../../utils/error-handler");
class Permission {
}
_a = Permission;
Permission.set = async (user_id, role) => {
    const permissions = Permission.rolePermissions(role);
    const permission = await db_1.default.query({
        text: `SELECT * FROM lucid_permissions WHERE user_id = $1`,
        values: [user_id],
    });
    if (!permission.rows[0]) {
        const permRes = await db_1.default.query({
            text: `INSERT INTO lucid_permissions (user_id, permissions) VALUES ($1, $2) RETURNING *`,
            values: [user_id, permissions],
        });
        if (!permRes.rows[0]) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Permission Error",
                message: "There was an error setting the permissions.",
                status: 500,
            });
        }
        return permRes.rows[0];
    }
    else {
        const permRes = await db_1.default.query({
            text: `UPDATE lucid_permissions SET permissions = $1 WHERE user_id = $2 RETURNING *`,
            values: [permissions, user_id],
        });
        if (!permRes.rows[0]) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Permission Error",
                message: "There was an error setting the permissions.",
                status: 500,
            });
        }
        return permRes.rows[0];
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