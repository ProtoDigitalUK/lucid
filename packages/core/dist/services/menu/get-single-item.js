"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const Menu_1 = __importDefault(require("../../db/models/Menu"));
const getSingleItem = async (data) => {
    const menuItem = await Menu_1.default.getSingleItem(data.id, data.menu_id);
    if (!menuItem) {
        throw new error_handler_1.LucidError({
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