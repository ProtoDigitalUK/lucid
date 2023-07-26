import { PoolClient } from "pg";
export interface ServiceData {
    key: string;
}
declare const getSingle: (client: PoolClient, data: ServiceData) => Promise<import("../../../../types/src/environments").EnvironmentResT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map