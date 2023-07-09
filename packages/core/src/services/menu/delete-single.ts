// Models
import Menu from "@db/models/Menu";

export interface ServiceData {
  environment_key: string;
  id: number;
}

const deleteSingle = async (data: ServiceData) => {
  const menu = await Menu.deleteSingle({
    environment_key: data.environment_key,
    id: data.id,
  });

  return menu;
};

export default deleteSingle;
