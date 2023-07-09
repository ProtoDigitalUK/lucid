// Models
import Menu from "@db/models/Menu";
// Schema
import { MenuItemUpdate } from "@schemas/menus";

export interface ServiceData {
  environment_key: string;
  id: number;
  key?: string;
  name?: string;
  description?: string;
  items?: MenuItemUpdate[];
}

const getSingle = async (data: ServiceData) => {
  const menu = await Menu.updateSingle({
    environment_key: data.environment_key,
    id: data.id,
    key: data.key,
    name: data.name,
    description: data.description,
    items: data.items,
  });

  return menu;
};

export default getSingle;
