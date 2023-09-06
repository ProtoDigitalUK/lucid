import { LucidError } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import Menu from "../../db/models/Menu.js";
import menuServices from "../menu/index.js";
const updateSingle = async (client, data) => {
    const getMenu = await service(menuServices.getSingle, false, client)({
        id: data.id,
        environment_key: data.environment_key,
    });
    if (getMenu.key === data.key) {
        delete data.key;
    }
    if (data.key) {
        await service(menuServices.checkKeyUnique, false, client)({
            key: data.key,
            environment_key: data.environment_key,
        });
    }
    const menu = await Menu.updateSingle(client, {
        environment_key: data.environment_key,
        id: data.id,
        key: data.key,
        name: data.name,
        description: data.description,
    });
    if (!menu) {
        throw new LucidError({
            type: "basic",
            name: "Menu Update Error",
            message: "Menu could not be updated",
            status: 500,
        });
    }
    if (data.items) {
        const originalItems = await service(menuServices.getItems, false, client)({
            menu_ids: [getMenu.id],
        });
        const updatedItems = await service(menuServices.upsertMultipleItems, false, client)({
            menu_id: getMenu.id,
            items: data.items,
        });
        const deleteItems = originalItems.filter((item) => {
            return (updatedItems.findIndex((updatedItem) => updatedItem.id === item.id) ===
                -1);
        });
        await service(menuServices.deleteItemsByIds, false, client)({
            ids: deleteItems.map((item) => item.id),
        });
    }
    return await service(menuServices.getSingle, false, client)({
        id: data.id,
        environment_key: data.environment_key,
    });
};
export default updateSingle;
//# sourceMappingURL=update-single.js.map