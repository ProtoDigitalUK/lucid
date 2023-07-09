// Models
import Environment from "@db/models/Environment";

interface ServiceData {
  key: string;
}

const getSingle = async (data: ServiceData) => {
  const environment = await Environment.getSingle(data.key);

  return environment;
};

export default getSingle;
