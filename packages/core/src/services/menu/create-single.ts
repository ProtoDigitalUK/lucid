// Models
import Menu from "@db/models/Menu";
// Schema
import { MenuItem } from "@schemas/menus";

export interface ServiceData {
  environment_key: string;
  key: string;
  name: string;
  description?: string;
  items?: MenuItem[];
}

const createSingle = async (data: ServiceData) => {
  const menu = await Menu.createSingle({
    environment_key: data.environment_key,
    key: data.key,
    name: data.name,
    description: data.description,
    items: data.items,
  });

  return menu;
};

export default createSingle;
