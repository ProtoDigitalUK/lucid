import { PoolClient } from "pg";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
// Models
import Menu from "@db/models/Menu.js";

export interface ServiceData {
  environment_key: string;
  id: number;
}

const deleteSingle = async (client: PoolClient, data: ServiceData) => {
  const menu = await Menu.deleteSingle(client, {
    environment_key: data.environment_key,
    id: data.id,
  });

  if (!menu) {
    throw new HeadlessError({
      type: "basic",
      name: "Menu Delete Error",
      message: "Menu could not be deleted",
      status: 500,
    });
  }

  return menu;
};

export default deleteSingle;
