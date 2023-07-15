"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Menu_1 = __importDefault(require("../../db/models/Menu"));
const getItems = async (client, data) => {
    const items = await Menu_1.default.getMenuItems(client, {
        menu_ids: data.menu_ids,
    });
    return items;
};
exports.default = getItems;
//# sourceMappingURL=get-items.js.map