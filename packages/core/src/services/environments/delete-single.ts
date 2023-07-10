// Models
import Environment from "@db/models/Environment";
// Utils
import { LucidError } from "@utils/app/error-handler";
// Services
import environments from "@services/environments";

export interface ServiceData {
  key: string;
}

const deleteSingle = async (data: ServiceData) => {
  // Check if environment exists
  await environments.getSingle({
    key: data.key,
  });

  const environment = await Environment.deleteSingle(data.key);

  if (!environment) {
    throw new LucidError({
      type: "basic",
      name: "Environment not deleted",
      message: `Environment with key "${data.key}" could not be deleted`,
      status: 400,
    });
  }

  return environments.format(environment);
};

export default deleteSingle;
