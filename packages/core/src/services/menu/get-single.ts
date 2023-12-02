import { PoolClient } from "pg";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Models
import Menu from "@db/models/Menu.js";
// Services
import menuServices from "@services/menu/index.js";
// Format
import formatMenu from "@utils/format/format-menu.js";

export interface ServiceData {
  environment_key: string;
  id: number;
}

const getSingle = async (client: PoolClient, data: ServiceData) => {
  const menu = await Menu.getSingle(client, {
    environment_key: data.environment_key,
    id: data.id,
  });

  if (!menu) {
    throw new HeadlessError({
      type: "basic",
      name: "Menu Get Error",
      message: `Menu with id ${data.id} not found in environment ${data.environment_key}.`,
      status: 404,
    });
  }

  const menuItems = await service(
    menuServices.getItems,
    false,
    client
  )({
    menu_ids: [menu.id],
  });

  return formatMenu(menu, menuItems);
};

export default getSingle;
