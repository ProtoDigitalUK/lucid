import { PoolClient } from "pg";
export interface ServiceData {
    key: string;
}
declare const clearSingle: (client: PoolClient, data: ServiceData) => Promise<void>;
export default clearSingle;
//# sourceMappingURL=clear-single.d.ts.map