import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Models
import Menu from "@db/models/Menu.js";
// Schema
import { MenuItem } from "@schemas/menus.js";
// Serices
import menuServices from "@services/menu/index.js";
// Format
import formatMenu from "@utils/format/format-menu.js";

export interface ServiceData {
  environment_key: string;
  key: string;
  name: string;
  description?: string;
  items?: MenuItem[];
}

const createSingle = async (client: PoolClient, data: ServiceData) => {
  // Check if key is unique
  await service(
    menuServices.checkKeyUnique,
    false,
    client
  )({
    key: data.key,
    environment_key: data.environment_key,
  });

  const menu = await Menu.createSingle(client, {
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
    await service(
      menuServices.upsertMultipleItems,
      false,
      client
    )({
      menu_id: menu.id,
      items: data.items,
    });
  }

  const menuItems = await service(
    menuServices.getItems,
    false,
    client
  )({
    menu_ids: [menu.id],
  });

  // -------------------------------------------
  // Return Menu
  return formatMenu(menu, menuItems);
};

export default createSingle;
