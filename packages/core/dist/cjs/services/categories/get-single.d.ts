import { PoolClient } from "pg";
export interface ServiceData {
    environment_key: string;
    id: number;
}
declare const getSingle: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/Category.js").CategoryT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map