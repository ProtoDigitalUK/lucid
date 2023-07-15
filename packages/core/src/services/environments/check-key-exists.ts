import { PoolClient } from "pg";
// Models
import Environment from "@db/models/Environment";
// Utils
import { LucidError } from "@utils/app/error-handler";

export interface ServiceData {
  key: string;
}

const checkKeyExists = async (client: PoolClient, data: ServiceData) => {
  const environment = await Environment.getSingle(client, {
    key: data.key,
  });

  if (environment) {
    throw new LucidError({
      type: "basic",
      name: "Environment already exists",
      message: `Environment with key "${data.key}" already exists`,
      status: 400,
    });
  }

  return;
};

export default checkKeyExists;
