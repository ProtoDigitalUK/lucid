"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_helpers_1 = require("../../utils/app/query-helpers");
const service_1 = __importDefault(require("../../utils/app/service"));
const Menu_1 = __importDefault(require("../../db/models/Menu"));
const menu_1 = __importDefault(require("../menu"));
const upsertItem = async (client, data) => {
    const itemsRes = [];
    const queryData = (0, query_helpers_1.queryDataFormat)({
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
        await (0, service_1.default)(menu_1.default.getSingleItem, false, client)({
            id: data.item.id,
            menu_id: data.menu_id,
        });
        const updatedItem = await Menu_1.default.updateMenuItem(client, {
            item_id: data.item.id,
            query_data: queryData,
        });
        newParentId = updatedItem.id;
        itemsRes.push(updatedItem);
    }
    else {
        const newItem = await Menu_1.default.createMenuItem(client, {
            query_data: queryData,
        });
        newParentId = newItem.id;
        itemsRes.push(newItem);
    }
    if (data.item.children) {
        const promises = data.item.children.map((child, i) => (0, service_1.default)(upsertItem, false, client)({
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
exports.default = upsertItem;
//# sourceMappingURL=upsert-item.js.map