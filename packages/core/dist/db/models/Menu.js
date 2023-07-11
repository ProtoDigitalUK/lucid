"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const error_handler_1 = require("../../utils/app/error-handler");
const query_helpers_1 = require("../../utils/app/query-helpers");
const menu_1 = __importDefault(require("../../services/menu"));
class Menu {
}
_a = Menu;
Menu.createSingle = async (data) => {
    const client = await db_1.default;
    await menu_1.default.checkKeyUnique({
        key: data.key,
        environment_key: data.environment_key,
    });
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: ["environment_key", "key", "name", "description"],
        values: [data.environment_key, data.key, data.name, data.description],
    });
    const menu = await client.query({
        text: `INSERT INTO lucid_menus (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
        values: values.value,
    });
    if (!menu.rows[0]) {
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
                menu_id: menu.rows[0].id,
                items: data.items,
            });
        }
        catch (err) {
            await client.query({
                text: `DELETE FROM lucid_menus WHERE id = $1`,
                values: [menu.rows[0].id],
            });
            throw err;
        }
    }
    const menuItems = await menu_1.default.getItems({
        menu_ids: [menu.rows[0].id],
    });
    return menu_1.default.format(menu.rows[0], menuItems);
};
Menu.deleteSingle = async (data) => {
    const client = await db_1.default;
    const menu = await client.query({
        text: `DELETE FROM lucid_menus WHERE id = $1 AND environment_key = $2 RETURNING *`,
        values: [data.id, data.environment_key],
    });
    if (!menu.rows[0]) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Menu Delete Error",
            message: "Menu could not be deleted",
            status: 500,
        });
    }
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
    if (!menu.rows[0]) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Menu Get Error",
            message: `Menu with id ${data.id} not found in environment ${data.environment_key}.`,
            status: 404,
        });
    }
    const menuItems = await menu_1.default.getItems({
        menu_ids: [menu.rows[0].id],
    });
    return menu_1.default.format(menu.rows[0], menuItems);
};
Menu.getMultiple = async (query, data) => {
    const client = await db_1.default;
    const { filter, sort, include, page, per_page } = query;
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
    const menus = await client.query({
        text: `SELECT
          ${SelectQuery.query.select}
        FROM
          lucid_menus
        ${SelectQuery.query.where}
        ${SelectQuery.query.order}
        ${SelectQuery.query.pagination}`,
        values: SelectQuery.values,
    });
    const count = await client.query({
        text: `SELECT 
          COUNT(DISTINCT lucid_menus.id)
        FROM
          lucid_menus
        ${SelectQuery.query.where} `,
        values: SelectQuery.countValues,
    });
    let menuItems = [];
    if (include && include.includes("items")) {
        menuItems = await menu_1.default.getItems({
            menu_ids: menus.rows.map((menu) => menu.id),
        });
    }
    return {
        data: menus.rows.map((menu) => menu_1.default.format(menu, menuItems)),
        count: count.rows[0].count,
    };
};
Menu.updateSingle = async (data) => {
    const client = await db_1.default;
    const getMenu = await Menu.getSingle({
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
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: ["key", "name", "description"],
        values: [data.key, data.name, data.description],
        conditional: {
            hasValues: {
                updated_at: new Date().toISOString(),
            },
        },
    });
    if (values.value.length > 0) {
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
        if (!menu.rows[0]) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Menu Update Error",
                message: "Menu could not be updated",
                status: 500,
            });
        }
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
            return (updatedItems.findIndex((updatedItem) => updatedItem.id === item.id) === -1);
        });
        await menu_1.default.deleteItemsByIds({
            ids: deleteItems.map((item) => item.id),
        });
    }
    return await Menu.getSingle({
        id: data.id,
        environment_key: data.environment_key,
    });
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