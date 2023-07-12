// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import Menu from "@db/models/Menu";
// Schema
import { MenuItem } from "@schemas/menus";
// Serices
import menuServices from "@services/menu";
// Format
import formatMenu from "@utils/format/format-menu";

export interface ServiceData {
  environment_key: string;
  key: string;
  name: string;
  description?: string;
  items?: MenuItem[];
}

const createSingle = async (data: ServiceData) => {
  // Check if key is unique
  await menuServices.checkKeyUnique({
    key: data.key,
    environment_key: data.environment_key,
  });

  const menu = await Menu.createSingle({
    environment_key: data.environment_key,
    key: data.key,
    name: data.name,
    description: data.description,
  });

  if (!menu) {
    throw new LucidError({
      type: "basic",
      name: "Menu Creation Error",
      message: "Menu could not be created",
      status: 500,
    });
  }

  // -------------------------------------------
  // Create Menu Items
  if (data.items) {
    try {
      await menuServices.upsertMultipleItems({
        menu_id: menu.id,
        items: data.items,
      });
    } catch (err) {
      await Menu.deleteSingle({
        id: menu.id,
        environment_key: data.environment_key,
      });
      throw err;
    }
  }

  const menuItems = await menuServices.getItems({
    menu_ids: [menu.id],
  });

  // -------------------------------------------
  // Return Menu
  return formatMenu(menu, menuItems);
};

export default createSingle;
