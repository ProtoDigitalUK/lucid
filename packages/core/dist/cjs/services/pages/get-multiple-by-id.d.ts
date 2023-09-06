import { PoolClient } from "pg";
export interface ServiceData {
    ids: Array<number>;
    environment_key: string;
}
declare const getMultipleById: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/Page.js").PageT[]>;
export default getMultipleById;
//# sourceMappingURL=get-multiple-by-id.d.ts.map