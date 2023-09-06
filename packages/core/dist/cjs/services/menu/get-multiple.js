"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_helpers_js_1 = require("../../utils/app/query-helpers.js");
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const Menu_js_1 = __importDefault(require("../../db/models/Menu.js"));
const index_js_1 = __importDefault(require("../menu/index.js"));
const format_menu_js_1 = __importDefault(require("../../utils/format/format-menu.js"));
const getMultiple = async (client, data) => {
    const { filter, sort, include, page, per_page } = data.query;
    const SelectQuery = new query_helpers_js_1.SelectQueryBuilder({
        columns: [
            "id",
            "key",
            "environment_key",
            "name",
            "description",
            "created_at",
            "updated_at",
        ],
        exclude: undefined,
        filter: {
            data: {
                ...filter,
                environment_key: data.environment_key,
            },
            meta: {
                name: {
                    operator: "%",
                    type: "text",
                    columnType: "standard",
                },
                environment_key: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
            },
        },
        sort: sort,
        page: page,
        per_page: per_page,
    });
    const menus = await Menu_js_1.default.getMultiple(client, SelectQuery);
    let menuItems = [];
    if (include && include.includes("items")) {
        menuItems = await (0, service_js_1.default)(index_js_1.default.getItems, false, client)({
            menu_ids: menus.data.map((menu) => menu.id),
        });
    }
    return {
        data: menus.data.map((menu) => (0, format_menu_js_1.default)(menu, menuItems)),
        count: menus.count,
    };
};
exports.default = getMultiple;
//# sourceMappingURL=get-multiple.js.map