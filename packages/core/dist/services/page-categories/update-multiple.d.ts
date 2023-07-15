import { PoolClient } from "pg";
export interface ServiceData {
    page_id: number;
    category_ids: Array<number>;
    collection_key: string;
}
declare const updateMultiple: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/PageCategory").PageCategoryT[]>;
export default updateMultiple;
//# sourceMappingURL=update-multiple.d.ts.map