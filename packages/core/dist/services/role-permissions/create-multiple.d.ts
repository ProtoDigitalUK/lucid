import { PoolClient } from "pg";
import { PermissionT, EnvironmentPermissionT } from "@lucid/types/src/permissions";
export interface ServiceData {
    role_id: number;
    permissions: Array<{
        permission: PermissionT | EnvironmentPermissionT;
        environment_key?: string;
    }>;
}
declare const createMultiple: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/RolePermission").RolePermissionT[]>;
export default createMultiple;
//# sourceMappingURL=create-multiple.d.ts.map