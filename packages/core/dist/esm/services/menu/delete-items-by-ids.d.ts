import { PoolClient } from "pg";
export interface ServiceData {
    ids: number[];
}
declare const deleteItemsByIds: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/Menu.js").MenuItemT[]>;
export default deleteItemsByIds;
//# sourceMappingURL=delete-items-by-ids.d.ts.map