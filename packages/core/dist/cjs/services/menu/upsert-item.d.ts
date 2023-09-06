import { PoolClient } from "pg";
import { MenuItemT } from "../../db/models/Menu.js";
import { MenuItemUpdate } from "../../schemas/menus.js";
export interface ServiceData {
    menu_id: number;
    item: MenuItemUpdate;
    pos: number;
    parentId?: number;
}
declare const upsertItem: (client: PoolClient, data: ServiceData) => Promise<MenuItemT[]>;
export default upsertItem;
//# sourceMappingURL=upsert-item.d.ts.map