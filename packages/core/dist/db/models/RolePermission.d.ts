type PermissionUsers = "create_user" | "read_user" | "update_user" | "delete_user";
type PermissionRoles = "create_role" | "read_role" | "update_role" | "delete_role" | "assign_role";
type PermissionMedia = "create_media" | "read_media" | "update_media" | "delete_media";
type PermissionSettings = "update_settings";
type PermissionEnvironment = "update_environment" | "migrate_environment";
type PermissionEmails = "read_email" | "delete_email" | "send_email";
type PermissionContent = "create_content" | "read_content" | "update_content" | "delete_content" | "publish_content" | "unpublish_content";
type PermissionCategory = "create_category" | "read_category" | "update_category" | "delete_category";
type PermissionMenu = "create_menu" | "read_menu" | "update_menu" | "delete_menu";
export type PermissionT = PermissionUsers | PermissionRoles | PermissionMedia | PermissionSettings | PermissionEnvironment | PermissionEmails;
export type EnvironmentPermissionT = PermissionContent | PermissionCategory | PermissionMenu;
type RolePermissionCreateMultiple = (role_id: number, permissions: Array<{
    permission: PermissionT | EnvironmentPermissionT;
    environment_key?: string;
}>) => Promise<RolePermissionT[]>;
type RolePermissionDeleteMultiple = (id: RolePermissionT["id"][]) => Promise<RolePermissionT[]>;
type RolePermissionGetAll = (role_id: number) => Promise<RolePermissionT[]>;
type RolePermissionDeleteAll = (role_id: number) => Promise<RolePermissionT[]>;
export type RolePermissionT = {
    id: number;
    role_id: string;
    permission: PermissionT | EnvironmentPermissionT;
    environment_key: string | null;
    created_at: string;
    updated_at: string;
};
export default class RolePermission {
    static createMultiple: RolePermissionCreateMultiple;
    static deleteMultiple: RolePermissionDeleteMultiple;
    static deleteAll: RolePermissionDeleteAll;
    static getAll: RolePermissionGetAll;
    static get getValidPermissions(): {
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
        };
    };
    static get permissions(): {
        global: PermissionT[];
        environment: EnvironmentPermissionT[];
    };
    static get userPermissions(): PermissionUsers[];
    static get rolePermissions(): PermissionRoles[];
    static get mediaPermissions(): PermissionMedia[];
    static get settingsPermissions(): PermissionSettings[];
    static get environmentPermissions(): PermissionEnvironment[];
    static get emailPermissions(): PermissionEmails[];
    static get contentPermissions(): PermissionContent[];
    static get categoryPermissions(): PermissionCategory[];
    static get menuPermissions(): PermissionMenu[];
}
export {};
//# sourceMappingURL=RolePermission.d.ts.map