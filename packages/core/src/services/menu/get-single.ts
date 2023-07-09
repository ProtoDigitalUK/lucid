// Models
import Menu from "@db/models/Menu";

export interface ServiceData {
  environment_key: string;
  id: number;
}

const getSingle = async (data: ServiceData) => {
  const menu = await Menu.getSingle({
    environment_key: data.environment_key,
    id: data.id,
  });

  return menu;
};

export default getSingle;
