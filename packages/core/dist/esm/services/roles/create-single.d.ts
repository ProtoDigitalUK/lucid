import { PoolClient } from "pg";
export interface ServiceData {
    name: string;
    permission_groups: Array<{
        environment_key?: string;
        permissions: string[];
    }>;
}
declare const createSingle: (client: PoolClient, data: ServiceData) => Promise<import("@lucid/types/src/roles.js").RoleResT>;
export default createSingle;
//# sourceMappingURL=create-single.d.ts.map