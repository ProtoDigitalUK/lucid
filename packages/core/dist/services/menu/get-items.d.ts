import { PoolClient } from "pg";
export interface ServiceData {
    menu_ids: number[];
}
declare const getItems: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/Menu").MenuItemT[]>;
export default getItems;
//# sourceMappingURL=get-items.d.ts.map