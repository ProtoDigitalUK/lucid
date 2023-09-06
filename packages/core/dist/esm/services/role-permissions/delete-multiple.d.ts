import { PoolClient } from "pg";
export interface ServiceData {
    ids: number[];
}
declare const deleteMultiple: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/RolePermission.js").RolePermissionT[]>;
export default deleteMultiple;
//# sourceMappingURL=delete-multiple.d.ts.map