// Models
import Environment from "@db/models/Environment";
// Utils
import { LucidError } from "@utils/app/error-handler";
// Format
import formatEnvironment from "@utils/format/format-environment";

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

  return formatEnvironment(environment);
};

export default getSingle;
