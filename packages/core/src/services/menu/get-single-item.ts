import { PoolClient } from "pg";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
// Models
import Menu from "@db/models/Menu.js";

export interface ServiceData {
  id: number;
  menu_id: number;
}

const getSingleItem = async (client: PoolClient, data: ServiceData) => {
  const menuItem = await Menu.getSingleItem(client, {
    id: data.id,
    menu_id: data.menu_id,
  });

  if (!menuItem) {
    throw new HeadlessError({
      type: "basic",
      name: "Menu Item Not Found",
      message: `Menu item with id "${data.id}" not found in menu with id "${data.menu_id}"`,
      status: 404,
    });
  }

  return menuItem;
};

export default getSingleItem;
