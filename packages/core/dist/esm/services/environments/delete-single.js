import Environment from "../../db/models/Environment.js";
import { LucidError } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import environmentsService from "../environments/index.js";
import formatEnvironment from "../../utils/format/format-environment.js";
const deleteSingle = async (client, data) => {
    await service(environmentsService.getSingle, false, client)({
        key: data.key,
    });
    const environment = await Environment.deleteSingle(client, {
        key: data.key,
    });
    if (!environment) {
        throw new LucidError({
            type: "basic",
            name: "Environment not deleted",
            message: `Environment with key "${data.key}" could not be deleted`,
            status: 400,
        });
    }
    return formatEnvironment(environment);
};
export default deleteSingle;
//# sourceMappingURL=delete-single.js.map