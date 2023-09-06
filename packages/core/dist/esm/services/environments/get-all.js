import Environment from "../../db/models/Environment.js";
import formatEnvironment from "../../utils/format/format-environment.js";
const getAll = async (client) => {
    const environmentsRes = await Environment.getAll(client);
    return environmentsRes.map((environment) => formatEnvironment(environment));
};
export default getAll;
//# sourceMappingURL=get-all.js.map