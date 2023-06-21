export type PermissionT = "create_user" | "read_user" | "update_user" | "delete_user" | "create_role" | "read_role" | "update_role" | "delete_role" | "assign_role" | "create_media" | "read_media" | "update_media" | "delete_media" | "update_settings";
export type EnvironmentPermissionT = `create_content` | `read_content` | `update_content` | `delete_content` | `publish_content` | `unpublish_content` | `create_category` | `update_category` | `delete_category` | `create_menu` | `read_menu` | `update_menu` | `delete_menu` | "update_environment" | "migrate_environment";
type RolePermissionCreateMultiple = (role_id: number, permissions: Array<{
    permission: PermissionT | EnvironmentPermissionT;
    environment_key?: string;
}>) => Promise<RolePermissionT[]>;
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
    static getPermissions: (role_id: number) => Promise<void>;
    static get permissions(): {
        global: PermissionT[];
        environment: EnvironmentPermissionT[];
    };
}
export {};
//# sourceMappingURL=RolePermission.d.ts.map