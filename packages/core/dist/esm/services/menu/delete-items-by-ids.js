import { LucidError } from "../../utils/app/error-handler.js";
import Menu from "../../db/models/Menu.js";
const deleteItemsByIds = async (client, data) => {
    const deletedItems = await Menu.deleteItemsByIds(client, {
        ids: data.ids,
    });
    if (deletedItems.length !== data.ids.length) {
        throw new LucidError({
            type: "basic",
            name: "Menu Item Delete Error",
            message: "Menu items could not be deleted",
            status: 500,
        });
    }
    return deletedItems;
};
export default deleteItemsByIds;
//# sourceMappingURL=delete-items-by-ids.js.map