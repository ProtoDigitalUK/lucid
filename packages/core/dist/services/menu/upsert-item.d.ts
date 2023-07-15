import { PoolClient } from "pg";
import { MenuItemT } from "../../db/models/Menu";
import { MenuItemUpdate } from "../../schemas/menus";
export interface ServiceData {
    menu_id: number;
    item: MenuItemUpdate;
    pos: number;
    parentId?: number;
}
declare const upsertItem: (client: PoolClient, data: ServiceData) => Promise<MenuItemT[]>;
export default upsertItem;
//# sourceMappingURL=upsert-item.d.ts.map