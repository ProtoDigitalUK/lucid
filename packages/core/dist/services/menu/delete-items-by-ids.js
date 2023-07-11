"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const Menu_1 = __importDefault(require("../../db/models/Menu"));
const deleteItemsByIds = async (data) => {
    const deletedItems = await Menu_1.default.deleteItemsByIds(data.ids);
    if (deletedItems.length !== data.ids.length) {
        throw new error_handler_1.LucidError({
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