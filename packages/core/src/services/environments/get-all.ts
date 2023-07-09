// Models
import Environment from "@db/models/Environment";

export interface ServiceData {}

const getAll = async (data: ServiceData) => {
  const environments = await Environment.getAll();

  return environments;
};

export default getAll;
