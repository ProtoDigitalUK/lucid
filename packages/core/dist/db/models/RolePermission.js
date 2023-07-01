"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const query_helpers_1 = require("../../utils/query-helpers");
class RolePermission {
    static get getValidPermissions() {
        return {
            global: {
                users: {
                    title: "Users",
                    permissions: RolePermission.userPermissions,
                },
                roles: {
                    title: "Roles",
                    permissions: RolePermission.rolePermissions,
                },
                media: {
                    title: "Media",
                    permissions: RolePermission.mediaPermissions,
                },
                settings: {
                    title: "Settings",
                    permissions: RolePermission.settingsPermissions,
                },
                environment: {
                    title: "Environment",
                    permissions: RolePermission.environmentPermissions,
                },
            },
            environment: {
                content: {
                    title: "Content",
                    permissions: RolePermission.contentPermissions,
                },
                category: {
                    title: "Category",
                    permissions: RolePermission.categoryPermissions,
                },
                menu: {
                    title: "Menu",
                    permissions: RolePermission.menuPermissions,
                },
            },
        };
    }
    static get permissions() {
        return {
            global: [
                ...RolePermission.userPermissions,
                ...RolePermission.rolePermissions,
                ...RolePermission.mediaPermissions,
                ...RolePermission.settingsPermissions,
                ...RolePermission.environmentPermissions,
            ],
            environment: [
                ...RolePermission.contentPermissions,
                ...RolePermission.categoryPermissions,
                ...RolePermission.menuPermissions,
            ],
        };
    }
    static get userPermissions() {
        return ["create_user", "read_user", "update_user", "delete_user"];
    }
    static get rolePermissions() {
        return [
            "create_role",
            "read_role",
            "update_role",
            "delete_role",
            "assign_role",
        ];
    }
    static get mediaPermissions() {
        return ["create_media", "read_media", "update_media", "delete_media"];
    }
    static get settingsPermissions() {
        return ["update_settings"];
    }
    static get environmentPermissions() {
        return ["update_environment", "migrate_environment"];
    }
    static get contentPermissions() {
        return [
            "create_content",
            "read_content",
            "update_content",
            "delete_content",
            "publish_content",
            "unpublish_content",
        ];
    }
    static get categoryPermissions() {
        return ["create_category", "update_category", "delete_category"];
    }
    static get menuPermissions() {
        return ["create_menu", "read_menu", "update_menu", "delete_menu"];
    }
}
_a = RolePermission;
RolePermission.createMultiple = async (role_id, permissions) => {
    const permissionsPromise = permissions.map((permission) => {
        const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
            columns: ["role_id", "permission", "environment_key"],
            values: [role_id, permission.permission, permission.environment_key],
        });
        return db_1.default.query({
            text: `INSERT INTO lucid_role_permissions (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
            values: values.value,
        });
    });
    const permissionsRes = await Promise.all(permissionsPromise);
    const permissionsData = permissionsRes.map((permission) => permission.rows[0]);
    return permissionsData;
};
RolePermission.deleteMultiple = async (ids) => {
    const permissionsPromise = ids.map((id) => {
        return db_1.default.query({
            text: `DELETE FROM lucid_role_permissions WHERE id = $1 RETURNING *`,
            values: [id],
        });
    });
    const permissionsRes = await Promise.all(permissionsPromise);
    const permissionsData = permissionsRes.map((permission) => permission.rows[0]);
    return permissionsData;
};
RolePermission.deleteAll = async (role_id) => {
    const res = await db_1.default.query({
        text: `DELETE FROM lucid_role_permissions WHERE role_id = $1 RETURNING *`,
        values: [role_id],
    });
    return res.rows;
};
RolePermission.getAll = async (role_id) => {
    const res = await db_1.default.query({
        text: `SELECT * FROM lucid_role_permissions WHERE role_id = $1`,
        values: [role_id],
    });
    return res.rows;
};
exports.default = RolePermission;
//# sourceMappingURL=RolePermission.js.map