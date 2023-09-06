"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const index_js_1 = __importDefault(require("../menu/index.js"));
const upsertMultipleItems = async (client, data) => {
    const itemsRes = [];
    const promises = data.items.map((item, i) => (0, service_js_1.default)(index_js_1.default.upsertItem, false, client)({
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