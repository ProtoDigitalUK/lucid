import { PoolClient } from "pg";
export interface ServiceData {
    user_id: number;
}
declare const getPermissions: (client: PoolClient, data: ServiceData) => Promise<import("@lucid/types/src/users").UserPermissionsResT>;
export default getPermissions;
//# sourceMappingURL=get-permissions.d.ts.map