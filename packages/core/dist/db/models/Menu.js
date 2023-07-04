"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _Menu_checkKeyIsUnique, _Menu_getMenuItems, _Menu_checkItemExists, _Menu_deleteMenuItemsByIds, _Menu_flattenMenuItems, _Menu_upsertMenuItem, _Menu_upsertMenuItems;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const error_handler_1 = require("../../utils/error-handler");
const query_helpers_1 = require("../../utils/query-helpers");
const format_menu_1 = __importDefault(require("../../services/menus/format-menu"));
class Menu {
}
_a = Menu;
Menu.createSingle = async (data) => {
    const client = await db_1.default;
    await __classPrivateFieldGet(Menu, _a, "f", _Menu_checkKeyIsUnique).call(Menu, data.key, data.environment_key);
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
            await __classPrivateFieldGet(Menu, _a, "f", _Menu_upsertMenuItems).call(Menu, menu.rows[0].id, data.items);
        }
        catch (err) {
            await client.query({
                text: `DELETE FROM lucid_menus WHERE id = $1`,
                values: [menu.rows[0].id],
            });
            throw err;
        }
    }
    const menuItems = await __classPrivateFieldGet(Menu, _a, "f", _Menu_getMenuItems).call(Menu, [menu.rows[0].id]);
    return (0, format_menu_1.default)(menu.rows[0], menuItems);
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
    const menuItems = await __classPrivateFieldGet(Menu, _a, "f", _Menu_getMenuItems).call(Menu, [menu.rows[0].id]);
    return (0, format_menu_1.default)(menu.rows[0], menuItems);
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
        menuItems = await __classPrivateFieldGet(Menu, _a, "f", _Menu_getMenuItems).call(Menu, menus.rows.map((menu) => menu.id));
    }
    return {
        data: menus.rows.map((menu) => (0, format_menu_1.default)(menu, menuItems)),
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
        await __classPrivateFieldGet(Menu, _a, "f", _Menu_checkKeyIsUnique).call(Menu, data.key, data.environment_key);
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
        const originalItems = await __classPrivateFieldGet(Menu, _a, "f", _Menu_getMenuItems).call(Menu, [getMenu.id]);
        let updatedItems = [];
        try {
            updatedItems = await __classPrivateFieldGet(Menu, _a, "f", _Menu_upsertMenuItems).call(Menu, getMenu.id, data.items);
        }
        catch (err) {
            const allItems = await __classPrivateFieldGet(Menu, _a, "f", _Menu_getMenuItems).call(Menu, [getMenu.id]);
            const deleteItems = allItems.filter((item) => {
                return (originalItems.findIndex((originalItem) => originalItem.id === item.id) === -1);
            });
            await __classPrivateFieldGet(Menu, _a, "f", _Menu_deleteMenuItemsByIds).call(Menu, deleteItems.map((item) => item.id));
            throw err;
        }
        const deleteItems = originalItems.filter((item) => {
            return (updatedItems.findIndex((updatedItem) => updatedItem.id === item.id) === -1);
        });
        await __classPrivateFieldGet(Menu, _a, "f", _Menu_deleteMenuItemsByIds).call(Menu, deleteItems.map((item) => item.id));
    }
    return await Menu.getSingle({
        id: data.id,
        environment_key: data.environment_key,
    });
};
_Menu_checkKeyIsUnique = { value: async (key, environment_key) => {
        const client = await db_1.default;
        const findMenu = await client.query({
            text: `SELECT * FROM lucid_menus WHERE key = $1 AND environment_key = $2`,
            values: [key, environment_key],
        });
        if (findMenu.rows.length > 0) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Menu Key Already Exists",
                message: `Menu key "${key}" already exists in environment "${environment_key}"`,
                status: 400,
            });
        }
        return true;
    } };
_Menu_getMenuItems = { value: async (menu_ids) => {
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
        if (!menuItems.rows[0]) {
            return [];
        }
        return menuItems.rows;
    } };
_Menu_checkItemExists = { value: async (id, menu_id) => {
        const client = await db_1.default;
        const menuItem = await client.query({
            text: `SELECT * FROM lucid_menu_items WHERE id = $1 AND menu_id = $2`,
            values: [id, menu_id],
        });
        if (!menuItem.rows[0]) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Menu Item Not Found",
                message: `Menu item with id "${id}" not found in menu with id "${menu_id}"`,
                status: 404,
            });
        }
        return true;
    } };
_Menu_deleteMenuItemsByIds = { value: async (ids) => {
        const client = await db_1.default;
        const deleted = await client.query({
            text: `DELETE FROM lucid_menu_items WHERE id = ANY($1::int[])`,
            values: [ids],
        });
        if (deleted.rowCount !== ids.length) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Menu Item Delete Error",
                message: "Menu items could not be deleted",
                status: 500,
            });
        }
        return deleted.rows;
    } };
_Menu_flattenMenuItems = { value: (items) => {
        const flattenedItems = [];
        items.forEach((item) => {
            const children = [...(item.children || [])];
            delete item.children;
            flattenedItems.push(item);
            if (children.length > 0) {
                __classPrivateFieldGet(Menu, _a, "f", _Menu_flattenMenuItems).call(Menu, children);
            }
        });
        return flattenedItems;
    } };
_Menu_upsertMenuItem = { value: async (menu_id, item, pos, parentId) => {
        const client = await db_1.default;
        const itemsRes = [];
        const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
            columns: [
                "menu_id",
                "parent_id",
                "url",
                "page_id",
                "name",
                "target",
                "position",
                "meta",
            ],
            values: [
                menu_id,
                parentId,
                item.url,
                item.page_id,
                item.name,
                item.target,
                pos,
                item.meta,
            ],
        });
        let newParentId = parentId;
        if (item.id) {
            await __classPrivateFieldGet(Menu, _a, "f", _Menu_checkItemExists).call(Menu, item.id, menu_id);
            const res = await client.query({
                text: `UPDATE lucid_menu_items SET ${columns.formatted.update} WHERE id = $${aliases.value.length + 1} RETURNING *`,
                values: [...values.value, item.id],
            });
            newParentId = res.rows[0].id;
            itemsRes.push(res.rows[0]);
        }
        else {
            const res = await client.query({
                text: `INSERT INTO lucid_menu_items (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
                values: values.value,
            });
            newParentId = res.rows[0].id;
            itemsRes.push(res.rows[0]);
        }
        if (item.children) {
            const promises = item.children.map((child, i) => __classPrivateFieldGet(Menu, _a, "f", _Menu_upsertMenuItem).call(Menu, menu_id, child, i, newParentId));
            const childrenRes = await Promise.all(promises);
            childrenRes.forEach((res) => itemsRes.push(...res));
        }
        return itemsRes;
    } };
_Menu_upsertMenuItems = { value: async (menu_id, items) => {
        const itemsRes = [];
        const promises = items.map((item, i) => __classPrivateFieldGet(Menu, _a, "f", _Menu_upsertMenuItem).call(Menu, menu_id, item, i));
        const res = await Promise.all(promises);
        res.forEach((items) => itemsRes.push(...items));
        return itemsRes;
    } };
exports.default = Menu;
//# sourceMappingURL=Menu.js.map