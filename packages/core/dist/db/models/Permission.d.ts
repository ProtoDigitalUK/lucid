type PermissionNames = "manage_users" | "manage_content" | "manage_settings" | "manage_environments";
type PermissionRoles = "admin" | "editor";
type PermissionSet = (user_id: string, role: PermissionRoles) => Promise<PermissionT>;
export type PermissionT = {
    id: string;
    user_id: string;
    permissions: PermissionNames[];
    created_at: string;
    updated_at: string;
};
export default class Permission {
    static set: PermissionSet;
    static rolePermissions: (role: PermissionRoles) => string[];
}
export {};
//# sourceMappingURL=Permission.d.ts.map