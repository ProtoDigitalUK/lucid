import { PoolClient } from "pg";
export interface ServiceData {
    id: number;
}
declare const clearSingle: (client: PoolClient, data: ServiceData) => Promise<void>;
export default clearSingle;
//# sourceMappingURL=clear-single.d.ts.map