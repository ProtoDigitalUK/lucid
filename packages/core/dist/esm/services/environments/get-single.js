import Environment from "../../db/models/Environment.js";
import { LucidError } from "../../utils/app/error-handler.js";
import formatEnvironment from "../../utils/format/format-environment.js";
const getSingle = async (client, data) => {
    const environment = await Environment.getSingle(client, {
        key: data.key,
    });
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
//# sourceMappingURL=get-single.js.map