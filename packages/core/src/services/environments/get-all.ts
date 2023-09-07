import { PoolClient } from "pg";
// Models
import Environment from "@db/models/Environment.js";
// Format
import formatEnvironment from "@utils/format/format-environment.js";

const getAll = async (client: PoolClient) => {
  const environmentsRes = await Environment.getAll(client);

  return environmentsRes.map((environment) => formatEnvironment(environment));
};

export default getAll;
