"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Permissions {
    static get formattedPermissions() {
        return {
            global: {
                users: {
                    title: "Users",
                    permissions: Permissions.userPermissions,
                },
                roles: {
                    title: "Roles",
                    permissions: Permissions.rolePermissions,
                },
                media: {
                    title: "Media",
                    permissions: Permissions.mediaPermissions,
                },
                settings: {
                    title: "Settings",
                    permissions: Permissions.settingsPermissions,
                },
                environment: {
                    title: "Environment",
                    permissions: Permissions.environmentPermissions,
                },
                emails: {
                    title: "Emails",
                    permissions: Permissions.emailPermissions,
                },
            },
            environment: {
                content: {
                    title: "Content",
                    permissions: Permissions.contentPermissions,
                },
                category: {
                    title: "Category",
                    permissions: Permissions.categoryPermissions,
                },
                menu: {
                    title: "Menu",
                    permissions: Permissions.menuPermissions,
                },
                form_submissions: {
                    title: "Form Submissions",
                    permissions: Permissions.formSubmissionsPermissions,
                },
            },
        };
    }
    static get permissions() {
        return {
            global: [
                ...Permissions.userPermissions,
                ...Permissions.rolePermissions,
                ...Permissions.mediaPermissions,
                ...Permissions.settingsPermissions,
                ...Permissions.environmentPermissions,
                ...Permissions.emailPermissions,
            ],
            environment: [
                ...Permissions.contentPermissions,
                ...Permissions.categoryPermissions,
                ...Permissions.menuPermissions,
                ...Permissions.formSubmissionsPermissions,
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
exports.default = Permissions;
//# sourceMappingURL=Permissions.js.map