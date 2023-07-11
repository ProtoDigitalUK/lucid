import { UserPermissionsRes } from "./format-permissions";
export interface UserResT {
    id: number;
    super_admin: boolean;
    email: string;
    username: string;
    first_name: string | null;
    last_name: string | null;
    roles?: UserPermissionsRes["roles"];
    permissions?: UserPermissionsRes["permissions"];
    created_at: string;
    updated_at: string;
}
declare const _default: {
    updateRoles: (data: import("./update-roles").ServiceData) => Promise<import("../../db/models/UserRole").UserRoleT[]>;
    formatPermissions: (permissionRes: import("../../db/models/UserRole").UserRolePermissionRes[]) => UserPermissionsRes;
    getAllRoles: (data: import("./get-all-roles").ServiceData) => Promise<import("../../db/models/UserRole").UserRoleT[]>;
    getPermissions: (data: import("./get-permissions").ServiceData) => Promise<UserPermissionsRes>;
    getSingle: (data: import("./get-single").ServiceData) => Promise<UserResT>;
    format: (user: import("../../db/models/User").UserT, permissions?: UserPermissionsRes | undefined) => UserResT;
};
export default _default;
//# sourceMappingURL=index.d.ts.map