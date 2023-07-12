import { UserRolePermissionRes } from "../../db/models/UserRole";
import { PermissionT, EnvironmentPermissionT } from "../../services/Permissions";
export interface UserRoleResT {
    id: number;
    name: string;
}
export interface UserEnvrionmentResT {
    key: string;
    permissions: Array<EnvironmentPermissionT>;
}
export interface UserPermissionsResT {
    roles: UserRoleResT[];
    permissions: {
        global: PermissionT[];
        environments: UserEnvrionmentResT[];
    };
}
declare const formatUserPermissions: (permissionRes: Array<UserRolePermissionRes>) => UserPermissionsResT;
export default formatUserPermissions;
//# sourceMappingURL=format-user-permissions.d.ts.map