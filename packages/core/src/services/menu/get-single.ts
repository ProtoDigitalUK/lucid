import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler";
import service from "@utils/app/service";
// Models
import Menu from "@db/models/Menu";
// Services
import menuServices from "@services/menu";
// Format
import formatMenu from "@utils/format/format-menu";

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
    throw new LucidError({
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
