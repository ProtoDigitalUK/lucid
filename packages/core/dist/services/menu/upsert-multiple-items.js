"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const menu_1 = __importDefault(require("../menu"));
const upsertMultipleItems = async (data) => {
    const itemsRes = [];
    const promises = data.items.map((item, i) => menu_1.default.upsertItem({
        menu_id: data.menu_id,
        item: item,
        pos: i,
    }));
    const res = await Promise.all(promises);
    res.forEach((items) => itemsRes.push(...items));
    return itemsRes;
};
exports.default = upsertMultipleItems;
//# sourceMappingURL=upsert-multiple-items.js.map