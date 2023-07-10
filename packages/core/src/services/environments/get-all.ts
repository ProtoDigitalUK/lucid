// Models
import Environment from "@db/models/Environment";
// Services
import environments from "@services/environments";

const getAll = async () => {
  const environmentsRes = await Environment.getAll();

  return environmentsRes.map((environment) => environments.format(environment));
};

export default getAll;
