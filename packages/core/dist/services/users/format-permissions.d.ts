import { UserRolePermissionRes } from "../../db/models/UserRole";
import { PermissionT, EnvironmentPermissionT } from "../../utils/app/Permissions";
export interface UserRoleRes {
    id: number;
    name: string;
}
export interface UserEnvrionmentRes {
    key: string;
    permissions: Array<EnvironmentPermissionT>;
}
export interface UserPermissionsRes {
    roles: UserRoleRes[];
    permissions: {
        global: PermissionT[];
        environments: UserEnvrionmentRes[];
    };
}
declare const formatPermissions: (permissionRes: Array<UserRolePermissionRes>) => UserPermissionsRes;
export default formatPermissions;
//# sourceMappingURL=format-permissions.d.ts.map