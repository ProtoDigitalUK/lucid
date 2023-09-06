import { PoolClient } from "pg";
export interface ServiceData {
    key: string;
}
declare const getSingleCount: (client: PoolClient, data: ServiceData) => Promise<number>;
export default getSingleCount;
//# sourceMappingURL=get-single-count.d.ts.map