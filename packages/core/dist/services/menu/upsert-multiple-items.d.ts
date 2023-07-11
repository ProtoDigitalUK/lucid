import { MenuItemT } from "../../db/models/Menu";
import { MenuItemUpdate } from "../../schemas/menus";
export interface ServiceData {
    menu_id: number;
    items: MenuItemUpdate[];
}
declare const upsertMultipleItems: (data: ServiceData) => Promise<MenuItemT[]>;
export default upsertMultipleItems;
//# sourceMappingURL=upsert-multiple-items.d.ts.map