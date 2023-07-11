import z from "zod";
import getDBClient from "@db/db";
// Schema
import menusSchema, { MenuItem, MenuItemUpdate } from "@schemas/menus";
// Utils
import { LucidError } from "@utils/app/error-handler";
import { queryDataFormat, SelectQueryBuilder } from "@utils/app/query-helpers";
import flattenMenuItems from "@utils/menus/flatten-menu-items";
// Serices
import menuServices, { MenuRes, ItemsRes } from "@services/menu";

// -------------------------------------------
// Types
type MenuCreateSingle = (data: {
  environment_key: string;
  key: string;
  name: string;
  description?: string;
  items?: MenuItem[];
}) => Promise<MenuT>;

type MenuDeleteSingle = (data: {
  environment_key: string;
  id: number;
}) => Promise<MenuT>;

type MenuGetSingle = (data: {
  environment_key: string;
  id: number;
}) => Promise<MenuRes>;

type MenuGetMultiple = (
  query: z.infer<typeof menusSchema.getMultiple.query>,
  data: {
    environment_key: string;
  }
) => Promise<{
  data: MenuRes[];
  count: number;
}>;

type MenuUpdateSingle = (data: {
  environment_key: string;
  id: number;
  key?: string;
  name?: string;
  description?: string;
  items?: MenuItemUpdate[];
}) => Promise<MenuT>;

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
  // -------------------------------------------
  // Functions
  static createSingle: MenuCreateSingle = async (data) => {
    const client = await getDBClient;

    // Check if key is unique
    await menuServices.checkKeyUnique({
      key: data.key,
      environment_key: data.environment_key,
    });

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

    if (!menu.rows[0]) {
      throw new LucidError({
        type: "basic",
        name: "Menu Creation Error",
        message: "Menu could not be created",
        status: 500,
      });
    }

    // -------------------------------------------
    // Create Menu Items
    if (data.items) {
      try {
        await menuServices.upsertMultipleItems({
          menu_id: menu.rows[0].id,
          items: data.items,
        });
      } catch (err) {
        await client.query({
          text: `DELETE FROM lucid_menus WHERE id = $1`,
          values: [menu.rows[0].id],
        });
        throw err;
      }
    }

    const menuItems = await menuServices.getItems({
      menu_ids: [menu.rows[0].id],
    });

    // -------------------------------------------
    // Return Menu
    return menuServices.format(menu.rows[0], menuItems);
  };
  static deleteSingle: MenuDeleteSingle = async (data) => {
    const client = await getDBClient;

    const menu = await client.query({
      text: `DELETE FROM lucid_menus WHERE id = $1 AND environment_key = $2 RETURNING *`,
      values: [data.id, data.environment_key],
    });

    if (!menu.rows[0]) {
      throw new LucidError({
        type: "basic",
        name: "Menu Delete Error",
        message: "Menu could not be deleted",
        status: 500,
      });
    }

    return menu.rows[0];
  };
  static getSingle: MenuGetSingle = async (data) => {
    const client = await getDBClient;

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

    if (!menu.rows[0]) {
      throw new LucidError({
        type: "basic",
        name: "Menu Get Error",
        message: `Menu with id ${data.id} not found in environment ${data.environment_key}.`,
        status: 404,
      });
    }

    const menuItems = await menuServices.getItems({
      menu_ids: [menu.rows[0].id],
    });

    return menuServices.format(menu.rows[0], menuItems);
  };
  static getMultiple: MenuGetMultiple = async (query, data) => {
    const client = await getDBClient;

    const { filter, sort, include, page, per_page } = query;

    // Build Query Data and Query
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

    const menus = await client.query<MenuT>({
      text: `SELECT
          ${SelectQuery.query.select}
        FROM
          lucid_menus
        ${SelectQuery.query.where}
        ${SelectQuery.query.order}
        ${SelectQuery.query.pagination}`,
      values: SelectQuery.values,
    });
    const count = await client.query<{ count: number }>({
      text: `SELECT 
          COUNT(DISTINCT lucid_menus.id)
        FROM
          lucid_menus
        ${SelectQuery.query.where} `,
      values: SelectQuery.countValues,
    });

    let menuItems: MenuItemT[] = [];
    if (include && include.includes("items")) {
      menuItems = await menuServices.getItems({
        menu_ids: menus.rows.map((menu) => menu.id),
      });
    }

    return {
      data: menus.rows.map((menu) => menuServices.format(menu, menuItems)),
      count: count.rows[0].count,
    };
  };
  static updateSingle: MenuUpdateSingle = async (data) => {
    const client = await getDBClient;

    // -------------------------------------------
    // Check Menu Exists
    const getMenu = await Menu.getSingle({
      id: data.id,
      environment_key: data.environment_key,
    });

    if (getMenu.key === data.key) {
      delete data.key;
    }

    if (data.key) {
      await menuServices.checkKeyUnique({
        key: data.key,
        environment_key: data.environment_key,
      });
    }

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
    if (values.value.length > 0) {
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

      if (!menu.rows[0]) {
        throw new LucidError({
          type: "basic",
          name: "Menu Update Error",
          message: "Menu could not be updated",
          status: 500,
        });
      }
    }

    // Update menu items if there are any
    if (data.items) {
      // Work out what items need to be created, updated and deleted
      const originalItems = await menuServices.getItems({
        menu_ids: [getMenu.id],
      });

      // create or update all items in the request
      let updatedItems: MenuItemT[] = [];
      try {
        updatedItems = await menuServices.upsertMultipleItems({
          menu_id: getMenu.id,
          items: data.items,
        });
      } catch (err) {
        // get all items, then remove anything that doesnt belong to the original menu
        const allItems = await menuServices.getItems({
          menu_ids: [getMenu.id],
        });
        const deleteItems = allItems.filter((item) => {
          return (
            originalItems.findIndex(
              (originalItem) => originalItem.id === item.id
            ) === -1
          );
        });
        // delete all items that are not in the original menu
        await menuServices.deleteItemsByIds({
          ids: deleteItems.map((item) => item.id),
        });
        throw err;
      }

      // delete all items, that id is not in the updated items
      const deleteItems = originalItems.filter((item) => {
        return (
          updatedItems.findIndex(
            (updatedItem) => updatedItem.id === item.id
          ) === -1
        );
      });
      // delete all items that are not in the updated items
      await menuServices.deleteItemsByIds({
        ids: deleteItems.map((item) => item.id),
      });
    }

    // -------------------------------------------
    // Return Updated Menu
    return await Menu.getSingle({
      id: data.id,
      environment_key: data.environment_key,
    });
  };
  static checkKeyIsUnique = async (key: string, environment_key: string) => {
    const client = await getDBClient;

    const findMenu = await client.query<MenuT>({
      text: `SELECT * FROM lucid_menus WHERE key = $1 AND environment_key = $2`,
      values: [key, environment_key],
    });

    return findMenu.rows[0];
  };
  // -------------------------------------------
  // Menu Items
  static getMenuItems = async (menu_ids: number[]) => {
    const client = await getDBClient;

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
      values: [menu_ids],
    });

    return menuItems.rows;
  };
  static getSingleItem = async (id: number, menu_id: number) => {
    const client = await getDBClient;

    const menuItem = await client.query<MenuItemT>({
      text: `SELECT * FROM lucid_menu_items WHERE id = $1 AND menu_id = $2`,
      values: [id, menu_id],
    });

    return menuItem.rows[0];
  };
  static deleteItemsByIds = async (ids: number[]) => {
    const client = await getDBClient;

    const deleted = await client.query<MenuItemT>({
      text: `DELETE FROM lucid_menu_items WHERE id = ANY($1::int[]) RETURNING *`,
      values: [ids],
    });

    return deleted.rows;
  };
  static updateMenuItem = async (
    item_id: number,
    query_data: ReturnType<typeof queryDataFormat>
  ) => {
    const client = await getDBClient;

    const res = await client.query<MenuItemT>({
      text: `UPDATE lucid_menu_items SET ${
        query_data.columns.formatted.update
      } WHERE id = $${query_data.aliases.value.length + 1} RETURNING *`,
      values: [...query_data.values.value, item_id],
    });

    return res.rows[0];
  };
  static createMenuItem = async (
    query_data: ReturnType<typeof queryDataFormat>
  ) => {
    const client = await getDBClient;

    const res = await client.query<MenuItemT>({
      text: `INSERT INTO lucid_menu_items (${query_data.columns.formatted.insert}) VALUES (${query_data.aliases.formatted.insert}) RETURNING *`,
      values: query_data.values.value,
    });

    return res.rows[0];
  };
}
