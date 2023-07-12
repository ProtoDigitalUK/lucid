// Models
import Environment from "@db/models/Environment";
// Format
import formatEnvironment from "@utils/format/format-environment";

const getAll = async () => {
  const environmentsRes = await Environment.getAll();

  return environmentsRes.map((environment) => formatEnvironment(environment));
};

export default getAll;
