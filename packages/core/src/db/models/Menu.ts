import { PoolClient } from "pg";
// Utils
import {
  queryDataFormat,
  SelectQueryBuilder,
} from "@utils/app/query-helpers.js";

// -------------------------------------------
// Types
type MenuCreateSingle = (
  client: PoolClient,
  data: {
    environment_key: string;
    key: string;
    name: string;
    description?: string;
  }
) => Promise<MenuT>;

type MenuDeleteSingle = (
  client: PoolClient,
  data: {
    environment_key: string;
    id: number;
  }
) => Promise<MenuT>;

type MenuGetSingle = (
  client: PoolClient,
  data: {
    environment_key: string;
    id: number;
  }
) => Promise<MenuT>;

type MenuGetMultiple = (
  client: PoolClient,
  query_instance: SelectQueryBuilder
) => Promise<{
  data: MenuT[];
  count: number;
}>;

type MenuUpdateSingle = (
  client: PoolClient,
  data: {
    environment_key: string;
    id: number;
    key?: string;
    name?: string;
    description?: string;
  }
) => Promise<MenuT>;

type MenuCheckKeyIsUnique = (
  client: PoolClient,
  data: {
    key: string;
    environment_key: string;
  }
) => Promise<MenuT>;

type MenuGetMenuItems = (
  client: PoolClient,
  data: {
    menu_ids: number[];
  }
) => Promise<MenuItemT[]>;

type MenuGetSingleItem = (
  client: PoolClient,
  data: {
    id: number;
    menu_id: number;
  }
) => Promise<MenuItemT>;

type MenuDeleteItemsByIds = (
  client: PoolClient,
  data: {
    ids: number[];
  }
) => Promise<MenuItemT[]>;

type MenuUpdateMenuItem = (
  client: PoolClient,
  data: {
    item_id: number;
    query_data: ReturnType<typeof queryDataFormat>;
  }
) => Promise<MenuItemT>;

type MenuCreateMenuItem = (
  client: PoolClient,
  data: {
    query_data: ReturnType<typeof queryDataFormat>;
  }
) => Promise<MenuItemT>;

// -------------------------------------------
// Menu
export type MenuT = {
  id: number;
  key: string;
  environment_key: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type MenuItemT = {
  id: number;
  menu_id: number;
  parent_id: number | null;
  page_id: number | null;
  name: string;
  url: string;
  target: "_self" | "_blank" | "_parent" | "_top";
  position: number;
  meta: any;
  full_slug: string | null;
};

export default class Menu {
  static createSingle: MenuCreateSingle = async (client, data) => {
    const { columns, aliases, values } = queryDataFormat({
      columns: ["environment_key", "key", "name", "description"],
      values: [data.environment_key, data.key, data.name, data.description],
    });

    // -------------------------------------------
    // Create Menu
    const menu = await client.query<MenuT>({
      text: `INSERT INTO lucid_menus (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value,
    });

    return menu.rows[0];
  };
  static deleteSingle: MenuDeleteSingle = async (client, data) => {
    const menu = await client.query({
      text: `DELETE FROM lucid_menus WHERE id = $1 AND environment_key = $2 RETURNING *`,
      values: [data.id, data.environment_key],
    });

    return menu.rows[0];
  };
  static getSingle: MenuGetSingle = async (client, data) => {
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

    const menu = await client.query<MenuT>({
      text: `SELECT
          ${SelectQuery.query.select}
        FROM
          lucid_menus
        ${SelectQuery.query.where}`,
      values: SelectQuery.values,
    });

    return menu.rows[0];
  };
  static getMultiple: MenuGetMultiple = async (client, query_instance) => {
    const menus = client.query<MenuT>({
      text: `SELECT ${query_instance.query.select} FROM lucid_menus ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
      values: query_instance.values,
    });
    const count = client.query<{ count: string }>({
      text: `SELECT COUNT(DISTINCT lucid_menus.id) FROM lucid_menus ${query_instance.query.where} `,
      values: query_instance.countValues,
    });

    const data = await Promise.all([menus, count]);

    return {
      data: data[0].rows,
      count: Number(data[1].rows[0].count),
    };
  };
  static updateSingle: MenuUpdateSingle = async (client, data) => {
    // -------------------------------------------
    // Build Query Data and Query
    const { columns, aliases, values } = queryDataFormat({
      columns: ["key", "name", "description"],
      values: [data.key, data.name, data.description],
      conditional: {
        hasValues: {
          updated_at: new Date().toISOString(),
        },
      },
    });

    // Update menu data if there is any
    const menu = await client.query<MenuT>({
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
  static checkKeyIsUnique: MenuCheckKeyIsUnique = async (client, data) => {
    const findMenu = await client.query<MenuT>({
      text: `SELECT * FROM lucid_menus WHERE key = $1 AND environment_key = $2`,
      values: [data.key, data.environment_key],
    });

    return findMenu.rows[0];
  };
  // -------------------------------------------
  // Menu Items
  static getMenuItems: MenuGetMenuItems = async (client, data) => {
    const menuItems = await client.query<MenuItemT>({
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
  static getSingleItem: MenuGetSingleItem = async (client, data) => {
    const menuItem = await client.query<MenuItemT>({
      text: `SELECT * FROM lucid_menu_items WHERE id = $1 AND menu_id = $2`,
      values: [data.id, data.menu_id],
    });

    return menuItem.rows[0];
  };
  static deleteItemsByIds: MenuDeleteItemsByIds = async (client, data) => {
    const deleted = await client.query<MenuItemT>({
      text: `DELETE FROM lucid_menu_items WHERE id = ANY($1::int[]) RETURNING *`,
      values: [data.ids],
    });

    return deleted.rows;
  };
  static updateMenuItem: MenuUpdateMenuItem = async (client, data) => {
    const res = await client.query<MenuItemT>({
      text: `UPDATE lucid_menu_items SET ${
        data.query_data.columns.formatted.update
      } WHERE id = $${data.query_data.aliases.value.length + 1} RETURNING *`,
      values: [...data.query_data.values.value, data.item_id],
    });

    return res.rows[0];
  };
  static createMenuItem: MenuCreateMenuItem = async (client, data) => {
    const res = await client.query<MenuItemT>({
      text: `INSERT INTO lucid_menu_items (${data.query_data.columns.formatted.insert}) VALUES (${data.query_data.aliases.formatted.insert}) RETURNING *`,
      values: data.query_data.values.value,
    });

    return res.rows[0];
  };
}
