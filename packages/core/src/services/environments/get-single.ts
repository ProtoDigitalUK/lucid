// Models
import Environment from "@db/models/Environment";
// Utils
import { LucidError } from "@utils/app/error-handler";
// Services
import environmentsService from "@services/environments";

export interface ServiceData {
  key: string;
}

const getSingle = async (data: ServiceData) => {
  const environment = await Environment.getSingle(data.key);

  if (!environment) {
    throw new LucidError({
      type: "basic",
      name: "Environment not found",
      message: `Environment with key "${data.key}" not found`,
      status: 404,
    });
  }

  return environmentsService.format(environment);
};

export default getSingle;
