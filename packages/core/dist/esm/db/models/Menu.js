import { queryDataFormat, SelectQueryBuilder, } from "../../utils/app/query-helpers.js";
export default class Menu {
    static createSingle = async (client, data) => {
        const { columns, aliases, values } = queryDataFormat({
            columns: ["environment_key", "key", "name", "description"],
            values: [data.environment_key, data.key, data.name, data.description],
        });
        const menu = await client.query({
            text: `INSERT INTO lucid_menus (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
            values: values.value,
        });
        return menu.rows[0];
    };
    static deleteSingle = async (client, data) => {
        const menu = await client.query({
            text: `DELETE FROM lucid_menus WHERE id = $1 AND environment_key = $2 RETURNING *`,
            values: [data.id, data.environment_key],
        });
        return menu.rows[0];
    };
    static getSingle = async (client, data) => {
        const SelectQuery = new SelectQueryBuilder({
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
    static getMultiple = async (client, query_instance) => {
        const menus = client.query({
            text: `SELECT ${query_instance.query.select} FROM lucid_menus ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
            values: query_instance.values,
        });
        const count = client.query({
            text: `SELECT COUNT(DISTINCT lucid_menus.id) FROM lucid_menus ${query_instance.query.where} `,
            values: query_instance.countValues,
        });
        const data = await Promise.all([menus, count]);
        return {
            data: data[0].rows,
            count: Number(data[1].rows[0].count),
        };
    };
    static updateSingle = async (client, data) => {
        const { columns, aliases, values } = queryDataFormat({
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
    static checkKeyIsUnique = async (client, data) => {
        const findMenu = await client.query({
            text: `SELECT * FROM lucid_menus WHERE key = $1 AND environment_key = $2`,
            values: [data.key, data.environment_key],
        });
        return findMenu.rows[0];
    };
    static getMenuItems = async (client, data) => {
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
            values: [data.menu_ids],
        });
        return menuItems.rows;
    };
    static getSingleItem = async (client, data) => {
        const menuItem = await client.query({
            text: `SELECT * FROM lucid_menu_items WHERE id = $1 AND menu_id = $2`,
            values: [data.id, data.menu_id],
        });
        return menuItem.rows[0];
    };
    static deleteItemsByIds = async (client, data) => {
        const deleted = await client.query({
            text: `DELETE FROM lucid_menu_items WHERE id = ANY($1::int[]) RETURNING *`,
            values: [data.ids],
        });
        return deleted.rows;
    };
    static updateMenuItem = async (client, data) => {
        const res = await client.query({
            text: `UPDATE lucid_menu_items SET ${data.query_data.columns.formatted.update} WHERE id = $${data.query_data.aliases.value.length + 1} RETURNING *`,
            values: [...data.query_data.values.value, data.item_id],
        });
        return res.rows[0];
    };
    static createMenuItem = async (client, data) => {
        const res = await client.query({
            text: `INSERT INTO lucid_menu_items (${data.query_data.columns.formatted.insert}) VALUES (${data.query_data.aliases.formatted.insert}) RETURNING *`,
            values: data.query_data.values.value,
        });
        return res.rows[0];
    };
}
//# sourceMappingURL=Menu.js.map