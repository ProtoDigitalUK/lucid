import Environment from "../../db/models/Environment.js";
import { LucidError } from "../../utils/app/error-handler.js";
const checkKeyExists = async (client, data) => {
    const environment = await Environment.getSingle(client, {
        key: data.key,
    });
    if (environment) {
        throw new LucidError({
            type: "basic",
            name: "Environment already exists",
            message: `Environment with key "${data.key}" already exists`,
            status: 400,
        });
    }
    return;
};
export default checkKeyExists;
//# sourceMappingURL=check-key-exists.js.map