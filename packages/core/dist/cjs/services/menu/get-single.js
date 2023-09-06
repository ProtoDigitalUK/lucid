"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const Menu_js_1 = __importDefault(require("../../db/models/Menu.js"));
const index_js_1 = __importDefault(require("../menu/index.js"));
const format_menu_js_1 = __importDefault(require("../../utils/format/format-menu.js"));
const getSingle = async (client, data) => {
    const menu = await Menu_js_1.default.getSingle(client, {
        environment_key: data.environment_key,
        id: data.id,
    });
    if (!menu) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Menu Get Error",
            message: `Menu with id ${data.id} not found in environment ${data.environment_key}.`,
            status: 404,
        });
    }
    const menuItems = await (0, service_js_1.default)(index_js_1.default.getItems, false, client)({
        menu_ids: [menu.id],
    });
    return (0, format_menu_js_1.default)(menu, menuItems);
};
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map