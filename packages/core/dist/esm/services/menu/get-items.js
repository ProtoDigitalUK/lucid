import Menu from "../../db/models/Menu.js";
const getItems = async (client, data) => {
    const items = await Menu.getMenuItems(client, {
        menu_ids: data.menu_ids,
    });
    return items;
};
export default getItems;
//# sourceMappingURL=get-items.js.map