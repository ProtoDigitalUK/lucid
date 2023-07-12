"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const Menu_1 = __importDefault(require("../../db/models/Menu"));
const menu_1 = __importDefault(require("../menu"));
const format_menu_1 = __importDefault(require("../../utils/format/format-menu"));
const getSingle = async (data) => {
    const menu = await Menu_1.default.getSingle({
        environment_key: data.environment_key,
        id: data.id,
    });
    if (!menu) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Menu Get Error",
            message: `Menu with id ${data.id} not found in environment ${data.environment_key}.`,
            status: 404,
        });
    }
    const menuItems = await menu_1.default.getItems({
        menu_ids: [menu.id],
    });
    return (0, format_menu_1.default)(menu, menuItems);
};
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map