"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PERMISSIONS = {
    users: {
        title: "Users",
        permissions: ["create_user", "read_users", "update_user", "delete_user"],
    },
    roles: {
        title: "Roles",
        permissions: [
            "create_role",
            "read_role",
            "update_role",
            "delete_role",
            "assign_role",
        ],
    },
    media: {
        title: "Media",
        permissions: ["create_media", "read_media", "update_media", "delete_media"],
    },
    settings: {
        title: "Settings",
        permissions: ["update_settings"],
    },
    environment: {
        title: "Environment",
        permissions: [
            "update_environment",
            "migrate_environment",
            "delete_environment",
            "create_environment",
        ],
    },
    emails: {
        title: "Emails",
        permissions: ["read_email", "delete_email", "send_email"],
    },
    content: {
        title: "Content",
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
        title: "Category",
        permissions: [
            "create_category",
            "read_category",
            "update_category",
            "delete_category",
        ],
    },
    menu: {
        title: "Menu",
        permissions: ["create_menu", "read_menu", "update_menu", "delete_menu"],
    },
    form_submissions: {
        title: "Form Submissions",
        permissions: [
            "read_form_submissions",
            "delete_form_submissions",
            "update_form_submissions",
        ],
    },
};
class Permissions {
    static get formattedPermissions() {
        return {
            global: {
                users: PERMISSIONS.users,
                roles: PERMISSIONS.roles,
                media: PERMISSIONS.media,
                settings: PERMISSIONS.settings,
                environment: PERMISSIONS.environment,
                emails: PERMISSIONS.emails,
            },
            environment: {
                content: PERMISSIONS.content,
                category: PERMISSIONS.category,
                menu: PERMISSIONS.menu,
                form_submissions: PERMISSIONS.form_submissions,
            },
        };
    }
    static get permissions() {
        const globalPermissions = Object.values(PERMISSIONS).flatMap((group) => group.permissions);
        const environmentPermissions = Object.values(PERMISSIONS).flatMap((group) => group.permissions);
        return {
            global: globalPermissions,
            environment: environmentPermissions,
        };
    }
}
exports.default = Permissions;
//# sourceMappingURL=Permissions.js.map