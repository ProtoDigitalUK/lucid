import { PoolClient } from "pg";
// Models
import Environment from "@db/models/Environment";
// Utils
import { LucidError } from "@utils/app/error-handler";
import service from "@utils/app/service";
// Services
import environmentsService from "@services/environments";
// Format
import formatEnvironment from "@utils/format/format-environment";

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
    throw new LucidError({
      type: "basic",
      name: "Environment not deleted",
      message: `Environment with key "${data.key}" could not be deleted`,
      status: 400,
    });
  }

  return formatEnvironment(environment);
};

export default deleteSingle;
