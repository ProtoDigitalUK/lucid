import { PoolClient } from "pg";
export interface ServiceData {
    id: number;
}
declare const getSingle: (client: PoolClient, data: ServiceData) => Promise<import("@lucid/types/src/roles.js").RoleResT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map