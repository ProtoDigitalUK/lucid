import service from "../../utils/app/service.js";
import menuService from "../menu/index.js";
const upsertMultipleItems = async (client, data) => {
    const itemsRes = [];
    const promises = data.items.map((item, i) => service(menuService.upsertItem, false, client)({
        menu_id: data.menu_id,
        item: item,
        pos: i,
    }));
    const res = await Promise.all(promises);
    res.forEach((items) => itemsRes.push(...items));
    return itemsRes;
};
export default upsertMultipleItems;
//# sourceMappingURL=upsert-multiple-items.js.map