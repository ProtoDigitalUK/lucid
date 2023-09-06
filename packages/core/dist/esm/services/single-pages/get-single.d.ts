import { PoolClient } from "pg";
export interface ServiceData {
    environment_key: string;
    collection_key: string;
    user_id: number;
    include_bricks?: boolean;
}
declare const getSingle: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/SinglePage.js").SinglePageT>;
export default getSingle;
//# sourceMappingURL=get-single.d.ts.map