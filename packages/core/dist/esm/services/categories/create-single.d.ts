import { PoolClient } from "pg";
export interface ServiceData {
    environment_key: string;
    collection_key: string;
    title: string;
    slug: string;
    description?: string;
}
declare const createSingle: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/Category.js").CategoryT>;
export default createSingle;
//# sourceMappingURL=create-single.d.ts.map