"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const query_helpers_1 = require("../../utils/app/query-helpers");
class Menu {
}
_a = Menu;
Menu.createSingle = async (data) => {
    const client = await db_1.default;
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: ["environment_key", "key", "name", "description"],
        values: [data.environment_key, data.key, data.name, data.description],
    });
    const menu = await client.query({
        text: `INSERT INTO lucid_menus (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
        values: values.value,
    });
    return menu.rows[0];
};
Menu.deleteSingle = async (data) => {
    const client = await db_1.default;
    const menu = await client.query({
        text: `DELETE FROM lucid_menus WHERE id = $1 AND environment_key = $2 RETURNING *`,
        values: [data.id, data.environment_key],
    });
    return menu.rows[0];
};
Menu.getSingle = async (data) => {
    const client = await db_1.default;
    const SelectQuery = new query_helpers_1.SelectQueryBuilder({
        columns: [
            "id",
            "key",
            "environment_key",
            "name",
            "description",
            "created_at",
            "updated_at",
        ],
        filter: {
            data: {
                id: data.id.toString(),
                environment_key: data.environment_key,
            },
            meta: {
                id: {
                    operator: "=",
                    type: "int",
                    columnType: "standard",
                },
                environment_key: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
            },
        },
    });
    const menu = await client.query({
        text: `SELECT
          ${SelectQuery.query.select}
        FROM
          lucid_menus
        ${SelectQuery.query.where}`,
        values: SelectQuery.values,
    });
    return menu.rows[0];
};
Menu.getMultiple = async (query_instance) => {
    const client = await db_1.default;
    const menus = await client.query({
        text: `SELECT ${query_instance.query.select} FROM lucid_menus ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
        values: query_instance.values,
    });
    const count = await client.query({
        text: `SELECT COUNT(DISTINCT lucid_menus.id) FROM lucid_menus ${query_instance.query.where} `,
        values: query_instance.countValues,
    });
    return {
        data: menus.rows,
        count: count.rows[0].count,
    };
};
Menu.updateSingle = async (data) => {
    const client = await db_1.default;
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: ["key", "name", "description"],
        values: [data.key, data.name, data.description],
        conditional: {
            hasValues: {
                updated_at: new Date().toISOString(),
            },
        },
    });
    const menu = await client.query({
        text: `UPDATE 
            lucid_menus 
          SET 
            ${columns.formatted.update} 
          WHERE 
            id = $${aliases.value.length + 1}
          AND 
            environment_key = $${aliases.value.length + 2}
          RETURNING *`,
        values: [...values.value, data.id, data.environment_key],
    });
    return menu.rows[0];
};
Menu.checkKeyIsUnique = async (key, environment_key) => {
    const client = await db_1.default;
    const findMenu = await client.query({
        text: `SELECT * FROM lucid_menus WHERE key = $1 AND environment_key = $2`,
        values: [key, environment_key],
    });
    return findMenu.rows[0];
};
Menu.getMenuItems = async (menu_ids) => {
    const client = await db_1.default;
    const menuItems = await client.query({
        text: `SELECT
          mi.*,
          p.full_slug
        FROM
          lucid_menu_items mi
        LEFT JOIN
          lucid_pages p ON mi.page_id = p.id
        WHERE
          mi.menu_id = ANY($1::int[])`,
        values: [menu_ids],
    });
    return menuItems.rows;
};
Menu.getSingleItem = async (id, menu_id) => {
    const client = await db_1.default;
    const menuItem = await client.query({
        text: `SELECT * FROM lucid_menu_items WHERE id = $1 AND menu_id = $2`,
        values: [id, menu_id],
    });
    return menuItem.rows[0];
};
Menu.deleteItemsByIds = async (ids) => {
    const client = await db_1.default;
    const deleted = await client.query({
        text: `DELETE FROM lucid_menu_items WHERE id = ANY($1::int[]) RETURNING *`,
        values: [ids],
    });
    return deleted.rows;
};
Menu.updateMenuItem = async (item_id, query_data) => {
    const client = await db_1.default;
    const res = await client.query({
        text: `UPDATE lucid_menu_items SET ${query_data.columns.formatted.update} WHERE id = $${query_data.aliases.value.length + 1} RETURNING *`,
        values: [...query_data.values.value, item_id],
    });
    return res.rows[0];
};
Menu.createMenuItem = async (query_data) => {
    const client = await db_1.default;
    const res = await client.query({
        text: `INSERT INTO lucid_menu_items (${query_data.columns.formatted.insert}) VALUES (${query_data.aliases.formatted.insert}) RETURNING *`,
        values: query_data.values.value,
    });
    return res.rows[0];
};
exports.default = Menu;
//# sourceMappingURL=Menu.js.map