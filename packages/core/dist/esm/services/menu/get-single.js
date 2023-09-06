import { LucidError } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import Menu from "../../db/models/Menu.js";
import menuServices from "../menu/index.js";
import formatMenu from "../../utils/format/format-menu.js";
const getSingle = async (client, data) => {
    const menu = await Menu.getSingle(client, {
        environment_key: data.environment_key,
        id: data.id,
    });
    if (!menu) {
        throw new LucidError({
            type: "basic",
            name: "Menu Get Error",
            message: `Menu with id ${data.id} not found in environment ${data.environment_key}.`,
            status: 404,
        });
    }
    const menuItems = await service(menuServices.getItems, false, client)({
        menu_ids: [menu.id],
    });
    return formatMenu(menu, menuItems);
};
export default getSingle;
//# sourceMappingURL=get-single.js.map