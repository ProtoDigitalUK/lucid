import { PoolClient } from "pg";
export interface ServiceData {
    brick_key: string;
    collection_key: string;
    environment_key: string;
}
declare const getSingle: (client: PoolClient, data: ServiceData) => Promise<import("../brick-config").BrickConfigT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map