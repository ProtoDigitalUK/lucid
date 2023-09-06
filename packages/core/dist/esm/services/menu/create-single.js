import { LucidError } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import Menu from "../../db/models/Menu.js";
import menuServices from "../menu/index.js";
import formatMenu from "../../utils/format/format-menu.js";
const createSingle = async (client, data) => {
    await service(menuServices.checkKeyUnique, false, client)({
        key: data.key,
        environment_key: data.environment_key,
    });
    const menu = await Menu.createSingle(client, {
        environment_key: data.environment_key,
        key: data.key,
        name: data.name,
        description: data.description,
    });
    if (!menu) {
        throw new LucidError({
            type: "basic",
            name: "Menu Creation Error",
            message: "Menu could not be created",
            status: 500,
        });
    }
    if (data.items) {
        await service(menuServices.upsertMultipleItems, false, client)({
            menu_id: menu.id,
            items: data.items,
        });
    }
    const menuItems = await service(menuServices.getItems, false, client)({
        menu_ids: [menu.id],
    });
    return formatMenu(menu, menuItems);
};
export default createSingle;
//# sourceMappingURL=create-single.js.map