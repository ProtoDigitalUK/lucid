import { LucidError } from "../../utils/app/error-handler.js";
import Menu from "../../db/models/Menu.js";
const checkKeyUnique = async (client, data) => {
    const menu = await Menu.checkKeyIsUnique(client, {
        key: data.key,
        environment_key: data.environment_key,
    });
    if (menu) {
        throw new LucidError({
            type: "basic",
            name: "Menu Key Already Exists",
            message: `Menu key "${data.key}" already exists in environment "${data.environment_key}"`,
            status: 400,
        });
    }
};
export default checkKeyUnique;
//# sourceMappingURL=check-key-unique.js.map