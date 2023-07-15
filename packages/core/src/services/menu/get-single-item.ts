// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import Menu from "@db/models/Menu";

export interface ServiceData {
  id: number;
  menu_id: number;
}

const getSingleItem = async (data: ServiceData) => {
  const menuItem = await Menu.getSingleItem({
    id: data.id,
    menu_id: data.menu_id,
  });

  if (!menuItem) {
    throw new LucidError({
      type: "basic",
      name: "Menu Item Not Found",
      message: `Menu item with id "${data.id}" not found in menu with id "${data.menu_id}"`,
      status: 404,
    });
  }

  return menuItem;
};

export default getSingleItem;
