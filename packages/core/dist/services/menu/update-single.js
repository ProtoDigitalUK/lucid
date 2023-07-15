"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const service_1 = __importDefault(require("../../utils/app/service"));
const Menu_1 = __importDefault(require("../../db/models/Menu"));
const menu_1 = __importDefault(require("../menu"));
const updateSingle = async (client, data) => {
    const getMenu = await (0, service_1.default)(menu_1.default.getSingle, false, client)({
        id: data.id,
        environment_key: data.environment_key,
    });
    if (getMenu.key === data.key) {
        delete data.key;
    }
    if (data.key) {
        await (0, service_1.default)(menu_1.default.checkKeyUnique, false, client)({
            key: data.key,
            environment_key: data.environment_key,
        });
    }
    const menu = await Menu_1.default.updateSingle(client, {
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
        const originalItems = await (0, service_1.default)(menu_1.default.getItems, false, client)({
            menu_ids: [getMenu.id],
        });
        const updatedItems = await (0, service_1.default)(menu_1.default.upsertMultipleItems, false, client)({
            menu_id: getMenu.id,
            items: data.items,
        });
        const deleteItems = originalItems.filter((item) => {
            return (updatedItems.findIndex((updatedItem) => updatedItem.id === item.id) ===
                -1);
        });
        await (0, service_1.default)(menu_1.default.deleteItemsByIds, false, client)({
            ids: deleteItems.map((item) => item.id),
        });
    }
    return await (0, service_1.default)(menu_1.default.getSingle, false, client)({
        id: data.id,
        environment_key: data.environment_key,
    });
};
exports.default = updateSingle;
//# sourceMappingURL=update-single.js.map