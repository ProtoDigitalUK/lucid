// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import Menu, { MenuItemT } from "@db/models/Menu";
// Schema
import { MenuItemUpdate } from "@schemas/menus";
// Serices
import menuServices from "@services/menu";

export interface ServiceData {
  environment_key: string;
  id: number;
  key?: string;
  name?: string;
  description?: string;
  items?: MenuItemUpdate[];
}

const updateSingle = async (data: ServiceData) => {
  // -------------------------------------------
  // Check Menu Exists
  const getMenu = await menuServices.getSingle({
    id: data.id,
    environment_key: data.environment_key,
  });

  if (getMenu.key === data.key) {
    delete data.key;
  }

  if (data.key) {
    await menuServices.checkKeyUnique({
      key: data.key,
      environment_key: data.environment_key,
    });
  }

  const menu = await Menu.updateSingle({
    environment_key: data.environment_key,
    id: data.id,
    key: data.key,
    name: data.name,
    description: data.description,
  });

  if (!menu) {
    throw new LucidError({
      type: "basic",
      name: "Menu Update Error",
      message: "Menu could not be updated",
      status: 500,
    });
  }

  // Update menu items if there are any
  if (data.items) {
    // Work out what items need to be created, updated and deleted
    const originalItems = await menuServices.getItems({
      menu_ids: [getMenu.id],
    });

    // create or update all items in the request
    let updatedItems: MenuItemT[] = [];
    try {
      updatedItems = await menuServices.upsertMultipleItems({
        menu_id: getMenu.id,
        items: data.items,
      });
    } catch (err) {
      // get all items, then remove anything that doesnt belong to the original menu
      const allItems = await menuServices.getItems({
        menu_ids: [getMenu.id],
      });
      const deleteItems = allItems.filter((item) => {
        return (
          originalItems.findIndex(
            (originalItem) => originalItem.id === item.id
          ) === -1
        );
      });
      // delete all items that are not in the original menu
      await menuServices.deleteItemsByIds({
        ids: deleteItems.map((item) => item.id),
      });
      throw err;
    }

    // delete all items, that id is not in the updated items
    const deleteItems = originalItems.filter((item) => {
      return (
        updatedItems.findIndex((updatedItem) => updatedItem.id === item.id) ===
        -1
      );
    });
    // delete all items that are not in the updated items
    await menuServices.deleteItemsByIds({
      ids: deleteItems.map((item) => item.id),
    });
  }

  // -------------------------------------------
  // Return Updated Menu
  return await menuServices.getSingle({
    id: data.id,
    environment_key: data.environment_key,
  });
};

export default updateSingle;
