"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const format_permissions_1 = __importDefault(require("../utils/format/format-permissions"));
class Permissions {
    static get raw() {
        return {
            users: {
                key: "users_permissions",
                permissions: [
                    "create_user",
                    "read_users",
                    "update_user",
                    "delete_user",
                ],
            },
            roles: {
                key: "roles_permissions",
                permissions: ["create_role", "read_role", "update_role", "delete_role"],
            },
            media: {
                key: "media_permissions",
                permissions: [
                    "create_media",
                    "read_media",
                    "update_media",
                    "delete_media",
                ],
            },
            settings: {
                key: "settings_permissions",
                permissions: ["update_settings"],
            },
            environment: {
                key: "environment_permissions",
                permissions: [
                    "update_environment",
                    "migrate_environment",
                    "delete_environment",
                    "create_environment",
                ],
            },
            emails: {
                key: "emails_permissions",
                permissions: ["read_email", "delete_email", "send_email"],
            },
            content: {
                key: "content_permissions",
                permissions: [
                    "create_content",
                    "read_content",
                    "update_content",
                    "delete_content",
                    "publish_content",
                    "unpublish_content",
                ],
            },
            category: {
                key: "category_permissions",
                permissions: [
                    "create_category",
                    "read_category",
                    "update_category",
                    "delete_category",
                ],
            },
            menu: {
                key: "menu_permissions",
                permissions: ["create_menu", "read_menu", "update_menu", "delete_menu"],
            },
            form_submissions: {
                key: "form_submissions_permissions",
                permissions: [
                    "read_form_submissions",
                    "delete_form_submissions",
                    "update_form_submissions",
                ],
            },
        };
    }
    static get permissions() {
        const formattedPermissions = (0, format_permissions_1.default)(Permissions.raw);
        const globalPermissions = formattedPermissions.global.flatMap((group) => group.permissions);
        const environmentPermissions = formattedPermissions.environment.flatMap((group) => group.permissions);
        return {
            global: globalPermissions,
            environment: environmentPermissions,
        };
    }
}
exports.default = Permissions;
//# sourceMappingURL=Permissions.js.map