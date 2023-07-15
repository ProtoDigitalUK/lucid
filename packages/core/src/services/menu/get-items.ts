// Models
import Menu from "@db/models/Menu";

export interface ServiceData {
  menu_ids: number[];
}

const getItems = async (data: ServiceData) => {
  const items = await Menu.getMenuItems({
    menu_ids: data.menu_ids,
  });
  return items;
};

export default getItems;
