// Utils
import { queryDataFormat } from "@utils/app/query-helpers";
// Models
import Menu, { MenuItemT } from "@db/models/Menu";
// Schema
import { MenuItemUpdate } from "@schemas/menus";
// Serivces
import menuServices from "@services/menu";

export interface ServiceData {
  menu_id: number;
  item: MenuItemUpdate;
  pos: number;
  parentId?: number;
}

const upsertItem = async (data: ServiceData) => {
  const itemsRes: MenuItemT[] = [];

  const queryData = queryDataFormat({
    columns: [
      "menu_id",
      "parent_id",
      "url",
      "page_id",
      "name",
      "target",
      "position",
      "meta",
    ],
    values: [
      data.menu_id,
      data.parentId,
      data.item.url,
      data.item.page_id,
      data.item.name,
      data.item.target,
      data.pos,
      data.item.meta,
    ],
  });

  let newParentId = data.parentId;

  // Update item
  if (data.item.id) {
    await menuServices.getSingleItem({
      id: data.item.id,
      menu_id: data.menu_id,
    });

    const updatedItem = await Menu.updateMenuItem({
      item_id: data.item.id,
      query_data: queryData,
    });
    newParentId = updatedItem.id;
    itemsRes.push(updatedItem);
  }
  // Create item
  else {
    const newItem = await Menu.createMenuItem({
      query_data: queryData,
    });
    newParentId = newItem.id;
    itemsRes.push(newItem);
  }

  // Update children
  if (data.item.children) {
    const promises = data.item.children.map(
      (child, i) =>
        upsertItem({
          menu_id: data.menu_id,
          item: child,
          pos: i,
          parentId: newParentId,
        }) // recursive call to handle children
    );
    const childrenRes = await Promise.all(promises);
    childrenRes.forEach((res) => itemsRes.push(...res));
  }

  return itemsRes;
};

export default upsertItem;
