// Models
import Environment from "@db/models/Environment";
// Utils
import { LucidError } from "@utils/app/error-handler";
// Services
import environments from "@services/environments";

export interface ServiceData {
  key: string;
}

const checkKeyExists = async (data: ServiceData) => {
  const environment = await Environment.checkKeyExists(data.key);

  if (environment) {
    throw new LucidError({
      type: "basic",
      name: "Environment already exists",
      message: `Environment with key "${data.key}" already exists`,
      status: 400,
    });
  }

  return environments.format(environment);
};

export default checkKeyExists;
