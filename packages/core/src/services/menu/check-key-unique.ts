import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler.js";
// Models
import Menu from "@db/models/Menu.js";

export interface ServiceData {
  key: string;
  environment_key: string;
}

const checkKeyUnique = async (client: PoolClient, data: ServiceData) => {
  const menu = await Menu.checkKeyIsUnique(client, {
    key: data.key,
    environment_key: data.environment_key,
  });

  if (menu) {
    throw new LucidError({
      type: "basic",
      name: "Menu Key Already Exists",
      message: `Menu key "${data.key}" already exists in environment "${data.environment_key}"`,
      status: 400,
    });
  }
};

export default checkKeyUnique;
