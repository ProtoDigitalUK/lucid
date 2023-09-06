"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const Menu_js_1 = __importDefault(require("../../db/models/Menu.js"));
const deleteItemsByIds = async (client, data) => {
    const deletedItems = await Menu_js_1.default.deleteItemsByIds(client, {
        ids: data.ids,
    });
    if (deletedItems.length !== data.ids.length) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Menu Item Delete Error",
            message: "Menu items could not be deleted",
            status: 500,
        });
    }
    return deletedItems;
};
exports.default = deleteItemsByIds;
//# sourceMappingURL=delete-items-by-ids.js.map