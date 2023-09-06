import { LucidError } from "../../utils/app/error-handler.js";
import Menu from "../../db/models/Menu.js";
const deleteSingle = async (client, data) => {
    const menu = await Menu.deleteSingle(client, {
        environment_key: data.environment_key,
        id: data.id,
    });
    if (!menu) {
        throw new LucidError({
            type: "basic",
            name: "Menu Delete Error",
            message: "Menu could not be deleted",
            status: 500,
        });
    }
    return menu;
};
export default deleteSingle;
//# sourceMappingURL=delete-single.js.map