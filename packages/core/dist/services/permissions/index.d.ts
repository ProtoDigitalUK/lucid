export type PermissionUsers = "create_user" | "read_user" | "update_user" | "delete_user";
export type PermissionRoles = "create_role" | "read_role" | "update_role" | "delete_role" | "assign_role";
export type PermissionMedia = "create_media" | "read_media" | "update_media" | "delete_media";
export type PermissionSettings = "update_settings";
export type PermissionEnvironment = "update_environment" | "migrate_environment" | "delete_environment" | "create_environment";
export type PermissionEmails = "read_email" | "delete_email" | "send_email";
export type PermissionContent = "create_content" | "read_content" | "update_content" | "delete_content" | "publish_content" | "unpublish_content";
export type PermissionCategory = "create_category" | "read_category" | "update_category" | "delete_category";
export type PermissionMenu = "create_menu" | "read_menu" | "update_menu" | "delete_menu";
export type PermissionFormSubmissions = "read_form_submissions" | "delete_form_submissions" | "update_form_submissions";
export type PermissionT = PermissionUsers | PermissionRoles | PermissionMedia | PermissionSettings | PermissionEnvironment | PermissionEmails;
export type EnvironmentPermissionT = PermissionContent | PermissionCategory | PermissionMenu | PermissionFormSubmissions;
declare const _default: {
    formatted: {
        global: {
            users: {
                title: string;
                permissions: PermissionUsers[];
            };
            roles: {
                title: string;
                permissions: PermissionRoles[];
            };
            media: {
                title: string;
                permissions: PermissionMedia[];
            };
            settings: {
                title: string;
                permissions: "update_settings"[];
            };
            environment: {
                title: string;
                permissions: PermissionEnvironment[];
            };
            emails: {
                title: string;
                permissions: PermissionEmails[];
            };
        };
        environment: {
            content: {
                title: string;
                permissions: PermissionContent[];
            };
            category: {
                title: string;
                permissions: PermissionCategory[];
            };
            menu: {
                title: string;
                permissions: PermissionMenu[];
            };
            form_submissions: {
                title: string;
                permissions: PermissionFormSubmissions[];
            };
        };
    };
    permissions: {
        global: PermissionT[];
        environment: EnvironmentPermissionT[];
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map