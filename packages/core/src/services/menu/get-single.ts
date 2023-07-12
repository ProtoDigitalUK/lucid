// Utils
import { LucidError } from "@utils/app/error-handler";
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

const getSingle = async (data: ServiceData) => {
  const menu = await Menu.getSingle({
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

  const menuItems = await menuServices.getItems({
    menu_ids: [menu.id],
  });

  return formatMenu(menu, menuItems);
};

export default getSingle;
