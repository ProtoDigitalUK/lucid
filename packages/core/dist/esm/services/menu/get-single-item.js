import { LucidError } from "../../utils/app/error-handler.js";
import Menu from "../../db/models/Menu.js";
const getSingleItem = async (client, data) => {
    const menuItem = await Menu.getSingleItem(client, {
        id: data.id,
        menu_id: data.menu_id,
    });
    if (!menuItem) {
        throw new LucidError({
            type: "basic",
            name: "Menu Item Not Found",
            message: `Menu item with id "${data.id}" not found in menu with id "${data.menu_id}"`,
            status: 404,
        });
    }
    return menuItem;
};
export default getSingleItem;
//# sourceMappingURL=get-single-item.js.map