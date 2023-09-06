import { PoolClient } from "pg";
export interface ServiceData {
    parent_id: number;
    environment_key: string;
    collection_key: string;
}
declare const parentChecks: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/Page.js").PageT>;
export default parentChecks;
//# sourceMappingURL=parent-checks.d.ts.map