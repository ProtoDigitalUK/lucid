"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const Menu_js_1 = __importDefault(require("../../db/models/Menu.js"));
const getSingleItem = async (client, data) => {
    const menuItem = await Menu_js_1.default.getSingleItem(client, {
        id: data.id,
        menu_id: data.menu_id,
    });
    if (!menuItem) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Menu Item Not Found",
            message: `Menu item with id "${data.id}" not found in menu with id "${data.menu_id}"`,
            status: 404,
        });
    }
    return menuItem;
};
exports.default = getSingleItem;
//# sourceMappingURL=get-single-item.js.map