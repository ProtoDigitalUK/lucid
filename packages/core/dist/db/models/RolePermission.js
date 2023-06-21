"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const query_helpers_1 = require("../../utils/query-helpers");
class RolePermission {
    static get permissions() {
        return {
            global: [
                "create_user",
                "read_user",
                "update_user",
                "delete_user",
                "create_role",
                "read_role",
                "update_role",
                "delete_role",
                "assign_role",
                "create_media",
                "read_media",
                "update_media",
                "delete_media",
                "update_settings",
            ],
            environment: [
                `create_content`,
                `read_content`,
                `update_content`,
                `delete_content`,
                `publish_content`,
                `unpublish_content`,
                `create_category`,
                `update_category`,
                `delete_category`,
                `create_menu`,
                `read_menu`,
                `update_menu`,
                `delete_menu`,
                "update_environment",
                "migrate_environment",
            ],
        };
    }
}
_a = RolePermission;
RolePermission.createMultiple = async (role_id, permissions) => {
    const permissionsPromise = permissions.map((permission) => {
        const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)(["role_id", "permission", "environment_key"], [role_id, permission.permission, permission.environment_key]);
        return db_1.default.query({
            text: `INSERT INTO lucid_role_permissions (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
            values: values.value,
        });
    });
    const permissionsRes = await Promise.all(permissionsPromise);
    const permissionsData = permissionsRes.map((permission) => permission.rows[0]);
    return permissionsData;
};
RolePermission.getPermissions = async (role_id) => { };
exports.default = RolePermission;
//# sourceMappingURL=RolePermission.js.map