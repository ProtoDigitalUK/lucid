// Models
import Environment from "@db/models/Environment";

interface ServiceData {
  key: string;
}

const deleteSingle = async (data: ServiceData) => {
  const environment = await Environment.deleteSingle(data.key);

  return environment;
};

export default deleteSingle;
