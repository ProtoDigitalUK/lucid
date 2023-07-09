import { EnvironmentPermissionT, PermissionT } from "../../db/models/RolePermission";
import { UserRolePermissionRes } from "../../db/models/UserRole";
export interface UserRoleRes {
    id: number;
    name: string;
}
export interface UserEnvrionmentRes {
    key: string;
    permissions: Array<EnvironmentPermissionT>;
}
declare const formatPermissions: (permissionRes: Array<UserRolePermissionRes>) => {
    roles: UserRoleRes[];
    permissions: {
        global: PermissionT[];
        environments: UserEnvrionmentRes[];
    };
};
export default formatPermissions;
//# sourceMappingURL=format-permissions.d.ts.map