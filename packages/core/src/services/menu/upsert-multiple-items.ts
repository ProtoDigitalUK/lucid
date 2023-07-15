import { PoolClient } from "pg";
// Utils
import service from "@utils/app/service";
// Models
import { MenuItemT } from "@db/models/Menu";
// Schema
import { MenuItemUpdate } from "@schemas/menus";
// Serivces
import menuService from "@services/menu";

export interface ServiceData {
  menu_id: number;
  items: MenuItemUpdate[];
}

const upsertMultipleItems = async (client: PoolClient, data: ServiceData) => {
  const itemsRes: MenuItemT[] = [];

  const promises = data.items.map((item, i) =>
    service(
      menuService.upsertItem,
      false,
      client
    )({
      menu_id: data.menu_id,
      item: item,
      pos: i,
    })
  );
  const res = await Promise.all(promises);
  res.forEach((items) => itemsRes.push(...items));

  return itemsRes;
};

export default upsertMultipleItems;
