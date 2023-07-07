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
                emails: {
                    title: "Emails",
                    permissions: RolePermission.emailPermissions,
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
                form_submissions: {
                    title: "Form Submissions",
                    permissions: RolePermission.formSubmissionsPermissions,
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
                ...RolePermission.emailPermissions,
            ],
            environment: [
                ...RolePermission.contentPermissions,
                ...RolePermission.categoryPermissions,
                ...RolePermission.menuPermissions,
                ...RolePermission.formSubmissionsPermissions,
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
        return [
            "update_environment",
            "migrate_environment",
            "delete_environment",
            "create_environment",
        ];
    }
    static get emailPermissions() {
        return ["send_email", "read_email", "delete_email"];
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
    static get formSubmissionsPermissions() {
        return [
            "read_form_submissions",
            "delete_form_submissions",
            "update_form_submissions",
        ];
    }
}
_a = RolePermission;
RolePermission.createMultiple = async (role_id, permissions) => {
    const client = await db_1.default;
    const permissionsPromise = permissions.map((permission) => {
        const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
            columns: ["role_id", "permission", "environment_key"],
            values: [role_id, permission.permission, permission.environment_key],
        });
        return client.query({
            text: `INSERT INTO lucid_role_permissions (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
            values: values.value,
        });
    });
    const permissionsRes = await Promise.all(permissionsPromise);
    const permissionsData = permissionsRes.map((permission) => permission.rows[0]);
    return permissionsData;
};
RolePermission.deleteMultiple = async (ids) => {
    const client = await db_1.default;
    const permissionsPromise = ids.map((id) => {
        return client.query({
            text: `DELETE FROM lucid_role_permissions WHERE id = $1 RETURNING *`,
            values: [id],
        });
    });
    const permissionsRes = await Promise.all(permissionsPromise);
    const permissionsData = permissionsRes.map((permission) => permission.rows[0]);
    return permissionsData;
};
RolePermission.deleteAll = async (role_id) => {
    const client = await db_1.default;
    const res = await client.query({
        text: `DELETE FROM lucid_role_permissions WHERE role_id = $1 RETURNING *`,
        values: [role_id],
    });
    return res.rows;
};
RolePermission.getAll = async (role_id) => {
    const client = await db_1.default;
    const res = await client.query({
        text: `SELECT * FROM lucid_role_permissions WHERE role_id = $1`,
        values: [role_id],
    });
    return res.rows;
};
exports.default = RolePermission;
//# sourceMappingURL=RolePermission.js.map