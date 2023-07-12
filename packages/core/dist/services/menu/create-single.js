"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const Menu_1 = __importDefault(require("../../db/models/Menu"));
const menu_1 = __importDefault(require("../menu"));
const format_menu_1 = __importDefault(require("../../utils/format/format-menu"));
const createSingle = async (data) => {
    await menu_1.default.checkKeyUnique({
        key: data.key,
        environment_key: data.environment_key,
    });
    const menu = await Menu_1.default.createSingle({
        environment_key: data.environment_key,
        key: data.key,
        name: data.name,
        description: data.description,
    });
    if (!menu) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Menu Creation Error",
            message: "Menu could not be created",
            status: 500,
        });
    }
    if (data.items) {
        try {
            await menu_1.default.upsertMultipleItems({
                menu_id: menu.id,
                items: data.items,
            });
        }
        catch (err) {
            await Menu_1.default.deleteSingle({
                id: menu.id,
                environment_key: data.environment_key,
            });
            throw err;
        }
    }
    const menuItems = await menu_1.default.getItems({
        menu_ids: [menu.id],
    });
    return (0, format_menu_1.default)(menu, menuItems);
};
exports.default = createSingle;
//# sourceMappingURL=create-single.js.map