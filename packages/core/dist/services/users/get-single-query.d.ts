import { PoolClient } from "pg";
export interface ServiceData {
    user_id?: number;
    email?: string;
    username?: string;
}
declare const getSingleQuery: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/User").UserT>;
export default getSingleQuery;
//# sourceMappingURL=get-single-query.d.ts.map