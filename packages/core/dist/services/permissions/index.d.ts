declare const _default: {
    getAll: (data: import("./get-all").ServiceData) => Promise<{
        global: {
            users: {
                title: string;
                permissions: ("create_user" | "read_user" | "update_user" | "delete_user")[];
            };
            roles: {
                title: string;
                permissions: ("create_role" | "read_role" | "update_role" | "delete_role" | "assign_role")[];
            };
            media: {
                title: string;
                permissions: ("create_media" | "read_media" | "update_media" | "delete_media")[];
            };
            settings: {
                title: string;
                permissions: "update_settings"[];
            };
            environment: {
                title: string;
                permissions: ("update_environment" | "migrate_environment" | "delete_environment" | "create_environment")[];
            };
            emails: {
                title: string;
                permissions: ("read_email" | "delete_email" | "send_email")[];
            };
        };
        environment: {
            content: {
                title: string;
                permissions: ("create_content" | "read_content" | "update_content" | "delete_content" | "publish_content" | "unpublish_content")[];
            };
            category: {
                title: string;
                permissions: ("create_category" | "read_category" | "update_category" | "delete_category")[];
            };
            menu: {
                title: string;
                permissions: ("create_menu" | "read_menu" | "update_menu" | "delete_menu")[];
            };
            form_submissions: {
                title: string;
                permissions: ("read_form_submissions" | "delete_form_submissions" | "update_form_submissions")[];
            };
        };
    }>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map