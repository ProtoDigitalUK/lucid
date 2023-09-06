import { PoolClient } from "pg";
export interface ServiceData {
    role_id: number;
}
declare const getAll: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/RolePermission.js").RolePermissionT[]>;
export default getAll;
//# sourceMappingURL=get-all.d.ts.map