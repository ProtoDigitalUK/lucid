import { PoolClient } from "pg";
export interface ServiceData {
    id: number;
}
declare const getSingle: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/Email").EmailT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map