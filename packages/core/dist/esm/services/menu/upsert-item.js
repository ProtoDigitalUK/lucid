import { queryDataFormat } from "../../utils/app/query-helpers.js";
import service from "../../utils/app/service.js";
import Menu from "../../db/models/Menu.js";
import menuServices from "../menu/index.js";
const upsertItem = async (client, data) => {
    const itemsRes = [];
    const queryData = queryDataFormat({
        columns: [
            "menu_id",
            "parent_id",
            "url",
            "page_id",
            "name",
            "target",
            "position",
            "meta",
        ],
        values: [
            data.menu_id,
            data.parentId,
            data.item.url,
            data.item.page_id,
            data.item.name,
            data.item.target,
            data.pos,
            data.item.meta,
        ],
    });
    let newParentId = data.parentId;
    if (data.item.id) {
        await service(menuServices.getSingleItem, false, client)({
            id: data.item.id,
            menu_id: data.menu_id,
        });
        const updatedItem = await Menu.updateMenuItem(client, {
            item_id: data.item.id,
            query_data: queryData,
        });
        newParentId = updatedItem.id;
        itemsRes.push(updatedItem);
    }
    else {
        const newItem = await Menu.createMenuItem(client, {
            query_data: queryData,
        });
        newParentId = newItem.id;
        itemsRes.push(newItem);
    }
    if (data.item.children) {
        const promises = data.item.children.map((child, i) => service(upsertItem, false, client)({
            menu_id: data.menu_id,
            item: child,
            pos: i,
            parentId: newParentId,
        }));
        const childrenRes = await Promise.all(promises);
        childrenRes.forEach((res) => itemsRes.push(...res));
    }
    return itemsRes;
};
export default upsertItem;
//# sourceMappingURL=upsert-item.js.map