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
const createSingle = async (client, data) => {
    await (0, service_js_1.default)(index_js_1.default.checkKeyUnique, false, client)({
        key: data.key,
        environment_key: data.environment_key,
    });
    const menu = await Menu_js_1.default.createSingle(client, {
        environment_key: data.environment_key,
        key: data.key,
        name: data.name,
        description: data.description,
    });
    if (!menu) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Menu Creation Error",
            message: "Menu could not be created",
            status: 500,
        });
    }
    if (data.items) {
        await (0, service_js_1.default)(index_js_1.default.upsertMultipleItems, false, client)({
            menu_id: menu.id,
            items: data.items,
        });
    }
    const menuItems = await (0, service_js_1.default)(index_js_1.default.getItems, false, client)({
        menu_ids: [menu.id],
    });
    return (0, format_menu_js_1.default)(menu, menuItems);
};
exports.default = createSingle;
//# sourceMappingURL=create-single.js.map