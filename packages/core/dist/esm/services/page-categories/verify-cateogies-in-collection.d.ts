import { PoolClient } from "pg";
export interface ServiceData {
    category_ids: Array<number>;
    collection_key: string;
}
declare const verifyCategoriesInCollection: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/PageCategory.js").PageCategoryT[]>;
export default verifyCategoriesInCollection;
//# sourceMappingURL=verify-cateogies-in-collection.d.ts.map