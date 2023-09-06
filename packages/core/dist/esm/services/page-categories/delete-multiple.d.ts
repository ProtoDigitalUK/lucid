import { PoolClient } from "pg";
export interface ServiceData {
    page_id: number;
    category_ids: Array<number>;
}
declare const deleteMultiple: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/PageCategory.js").PageCategoryT[]>;
export default deleteMultiple;
//# sourceMappingURL=delete-multiple.d.ts.map