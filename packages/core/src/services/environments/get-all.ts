// Models
import Environment from "@db/models/Environment";
// Services
import environmentsService from "@services/environments";

const getAll = async () => {
  const environmentsRes = await Environment.getAll();

  return environmentsRes.map((environment) =>
    environmentsService.format(environment)
  );
};

export default getAll;
