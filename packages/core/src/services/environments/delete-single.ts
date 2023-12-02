import { PoolClient } from "pg";
// Models
import Environment from "@db/models/Environment.js";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Services
import environmentsService from "@services/environments/index.js";
// Format
import formatEnvironment from "@utils/format/format-environment.js";

export interface ServiceData {
  key: string;
}

const deleteSingle = async (client: PoolClient, data: ServiceData) => {
  // Check if environment exists
  await service(
    environmentsService.getSingle,
    false,
    client
  )({
    key: data.key,
  });

  const environment = await Environment.deleteSingle(client, {
    key: data.key,
  });

  if (!environment) {
    throw new HeadlessError({
      type: "basic",
      name: "Environment not deleted",
      message: `Environment with key "${data.key}" could not be deleted`,
      status: 400,
    });
  }

  return formatEnvironment(environment);
};

export default deleteSingle;
