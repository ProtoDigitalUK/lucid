import { MenuItemT } from "../../db/models/Menu";
import { MenuItemUpdate } from "../../schemas/menus";
export interface ServiceData {
    menu_id: number;
    item: MenuItemUpdate;
    pos: number;
    parentId?: number;
}
declare const upsertItem: (data: ServiceData) => Promise<MenuItemT[]>;
export default upsertItem;
//# sourceMappingURL=upsert-item.d.ts.map