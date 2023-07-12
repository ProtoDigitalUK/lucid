import { PermissionT, EnvironmentPermissionT } from "../../services/Permissions";
type RolePermissionCreateSingle = (role_id: number, permission: PermissionT | EnvironmentPermissionT, environment_key?: string) => Promise<RolePermissionT>;
type RolePermissionDeleteSingle = (id: RolePermissionT["id"]) => Promise<RolePermissionT>;
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
    static createSingle: RolePermissionCreateSingle;
    static deleteSingle: RolePermissionDeleteSingle;
    static deleteAll: RolePermissionDeleteAll;
    static getAll: RolePermissionGetAll;
}
export {};
//# sourceMappingURL=RolePermission.d.ts.map