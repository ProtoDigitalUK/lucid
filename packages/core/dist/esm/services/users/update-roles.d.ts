import { PoolClient } from "pg";
export interface ServiceData {
    user_id: number;
    role_ids: number[];
}
declare const updateRoles: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/UserRole.js").UserRoleT[]>;
export default updateRoles;
//# sourceMappingURL=update-roles.d.ts.map