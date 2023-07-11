type PermissionUsers = "create_user" | "read_user" | "update_user" | "delete_user";
type PermissionRoles = "create_role" | "read_role" | "update_role" | "delete_role" | "assign_role";
type PermissionMedia = "create_media" | "read_media" | "update_media" | "delete_media";
type PermissionSettings = "update_settings";
type PermissionEnvironment = "update_environment" | "migrate_environment" | "delete_environment" | "create_environment";
type PermissionEmails = "read_email" | "delete_email" | "send_email";
type PermissionContent = "create_content" | "read_content" | "update_content" | "delete_content" | "publish_content" | "unpublish_content";
type PermissionCategory = "create_category" | "read_category" | "update_category" | "delete_category";
type PermissionMenu = "create_menu" | "read_menu" | "update_menu" | "delete_menu";
type PermissionFormSubmissions = "read_form_submissions" | "delete_form_submissions" | "update_form_submissions";
export type PermissionT = PermissionUsers | PermissionRoles | PermissionMedia | PermissionSettings | PermissionEnvironment | PermissionEmails;
export type EnvironmentPermissionT = PermissionContent | PermissionCategory | PermissionMenu | PermissionFormSubmissions;
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
}
export {};
//# sourceMappingURL=RolePermission.d.ts.map