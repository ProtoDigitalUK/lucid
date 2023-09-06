import { PoolClient } from "pg";
export interface ServiceData {
    key: string;
}
declare const getSingle: (client: PoolClient, data: ServiceData) => Promise<import("@lucid/types/src/environments.js").EnvironmentResT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map