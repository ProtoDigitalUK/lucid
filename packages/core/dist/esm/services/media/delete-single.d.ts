import { PoolClient } from "pg";
export interface ServiceData {
    id: number;
}
declare const deleteSingle: (client: PoolClient, data: ServiceData) => Promise<undefined>;
export default deleteSingle;
//# sourceMappingURL=delete-single.d.ts.map