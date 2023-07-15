import { PoolClient } from "pg";
import { PermissionT, EnvironmentPermissionT } from "../../services/Permissions";
type RolePermissionCreateSingle = (client: PoolClient, data: {
    role_id: number;
    permission: PermissionT | EnvironmentPermissionT;
    environment_key?: string;
}) => Promise<RolePermissionT>;
type RolePermissionDeleteSingle = (client: PoolClient, data: {
    id: RolePermissionT["id"];
}) => Promise<RolePermissionT>;
type RolePermissionGetAll = (client: PoolClient, data: {
    role_id: number;
}) => Promise<RolePermissionT[]>;
type RolePermissionDeleteAll = (client: PoolClient, data: {
    role_id: number;
}) => Promise<RolePermissionT[]>;
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