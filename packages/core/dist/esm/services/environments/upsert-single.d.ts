import { PoolClient } from "pg";
export interface ServiceData {
    data: {
        key: string;
        title?: string;
        assigned_bricks?: string[];
        assigned_collections?: string[];
        assigned_forms?: string[];
    };
    create: boolean;
}
declare const upsertSingle: (client: PoolClient, data: ServiceData) => Promise<import("@lucid/types/src/environments.js").EnvironmentResT>;
export default upsertSingle;
//# sourceMappingURL=upsert-single.d.ts.map