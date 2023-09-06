import { PoolClient } from "pg";
export interface ServiceData {
    id: number;
    name?: string;
    permission_groups?: Array<{
        environment_key?: string;
        permissions: string[];
    }>;
}
declare const updateSingle: (client: PoolClient, data: ServiceData) => Promise<import("@lucid/types/src/roles.js").RoleResT>;
export default updateSingle;
//# sourceMappingURL=update-single.d.ts.map