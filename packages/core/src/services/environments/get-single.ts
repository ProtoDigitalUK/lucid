import { PoolClient } from "pg";
// Models
import Environment from "@db/models/Environment.js";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
// Format
import formatEnvironment from "@utils/format/format-environment.js";

export interface ServiceData {
  key: string;
}

const getSingle = async (client: PoolClient, data: ServiceData) => {
  const environment = await Environment.getSingle(client, {
    key: data.key,
  });

  if (!environment) {
    throw new HeadlessError({
      type: "basic",
      name: "Environment not found",
      message: `Environment with key "${data.key}" not found`,
      status: 404,
    });
  }

  return formatEnvironment(environment);
};

export default getSingle;
