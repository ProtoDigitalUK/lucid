"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const Menu_1 = __importDefault(require("../../db/models/Menu"));
const menu_1 = __importDefault(require("../menu"));
const updateSingle = async (data) => {
    const getMenu = await menu_1.default.getSingle({
        id: data.id,
        environment_key: data.environment_key,
    });
    if (getMenu.key === data.key) {
        delete data.key;
    }
    if (data.key) {
        await menu_1.default.checkKeyUnique({
            key: data.key,
            environment_key: data.environment_key,
        });
    }
    const menu = await Menu_1.default.updateSingle({
        environment_key: data.environment_key,
        id: data.id,
        key: data.key,
        name: data.name,
        description: data.description,
    });
    if (!menu) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Menu Update Error",
            message: "Menu could not be updated",
            status: 500,
        });
    }
    if (data.items) {
        const originalItems = await menu_1.default.getItems({
            menu_ids: [getMenu.id],
        });
        let updatedItems = [];
        try {
            updatedItems = await menu_1.default.upsertMultipleItems({
                menu_id: getMenu.id,
                items: data.items,
            });
        }
        catch (err) {
            const allItems = await menu_1.default.getItems({
                menu_ids: [getMenu.id],
            });
            const deleteItems = allItems.filter((item) => {
                return (originalItems.findIndex((originalItem) => originalItem.id === item.id) === -1);
            });
            await menu_1.default.deleteItemsByIds({
                ids: deleteItems.map((item) => item.id),
            });
            throw err;
        }
        const deleteItems = originalItems.filter((item) => {
            return (updatedItems.findIndex((updatedItem) => updatedItem.id === item.id) ===
                -1);
        });
        await menu_1.default.deleteItemsByIds({
            ids: deleteItems.map((item) => item.id),
        });
    }
    return await menu_1.default.getSingle({
        id: data.id,
        environment_key: data.environment_key,
    });
};
exports.default = updateSingle;
//# sourceMappingURL=update-single.js.map