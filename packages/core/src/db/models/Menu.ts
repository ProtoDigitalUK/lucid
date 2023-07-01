import z from "zod";
import client from "@db/db";
// Utils
import { LucidError, modelErrors } from "@utils/error-handler";
import { queryDataFormat, SelectQueryBuilder } from "@utils/query-helpers";
// Schema
import menusSchema, { MenuItem } from "@schemas/menus";
// Services
import formatMenu, { MenuRes } from "@services/menus/format-menu";

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
  items?: MenuItem[];
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
    // Check if key is unique
    await Menu.#checkKeyIsUnique(data.key, data.environment_key);

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
        await Menu.#createMenuItems(menu.rows[0].id, data.items);
      } catch (err) {
        await client.query({
          text: `DELETE FROM lucid_menus WHERE id = $1`,
          values: [menu.rows[0].id],
        });
        throw err;
      }
    }

    const menuItems = await Menu.#getMenuItems([menu.rows[0].id]);

    // -------------------------------------------
    // Return Menu
    return formatMenu(menu.rows[0], menuItems);
  };
  static deleteSingle: MenuDeleteSingle = async (data) => {
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
            type: "string",
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

    const menuItems = await Menu.#getMenuItems([menu.rows[0].id]);

    return formatMenu(menu.rows[0], menuItems);
  };
  static getMultiple: MenuGetMultiple = async (query, data) => {
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
            operator: "ILIKE",
            type: "string",
            columnType: "standard",
          },
          environment_key: {
            operator: "=",
            type: "string",
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
      menuItems = await Menu.#getMenuItems(menus.rows.map((menu) => menu.id));
    }

    return {
      data: menus.rows.map((menu) => formatMenu(menu, menuItems)),
      count: count.rows[0].count,
    };
  };
  static updateSingle: MenuUpdateSingle = async (data) => {
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
      await Menu.#checkKeyIsUnique(data.key, data.environment_key);
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
      const originalMenuItems = await Menu.#getMenuItems([getMenu.id]);

      try {
        await Menu.#createMenuItems(getMenu.id, data.items);
      } catch (error) {
        // delete everything that was created
        const allItems = await Menu.#getMenuItems([getMenu.id]);
        const deleteItems = allItems.filter((item) => {
          return (
            originalMenuItems.findIndex(
              (originalItem) => originalItem.id === item.id
            ) === -1
          );
        });
        if (deleteItems.length > 0) {
          await Menu.#deleteMenuItemsByIds(deleteItems.map((item) => item.id));
        }
        throw error;
      }

      // delete all original items excluding new ones
      await Menu.#deleteMenuItemsByIds(
        originalMenuItems.map((item) => item.id)
      );
    }

    // -------------------------------------------
    // Return Updated Menu
    return await Menu.getSingle({
      id: data.id,
      environment_key: data.environment_key,
    });
  };
  // -------------------------------------------
  // Util Functions
  static #checkKeyIsUnique = async (key: string, environment_key: string) => {
    const findMenu = await client.query({
      text: `SELECT * FROM lucid_menus WHERE key = $1 AND environment_key = $2`,
      values: [key, environment_key],
    });

    if (findMenu.rows.length > 0) {
      throw new LucidError({
        type: "basic",
        name: "Menu Key Already Exists",
        message: `Menu key "${key}" already exists in environment "${environment_key}"`,
        status: 400,
      });
    }

    return true;
  };
  static #getMenuItems = async (menu_ids: number[]) => {
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

    if (!menuItems.rows[0]) {
      return [];
    }

    return menuItems.rows;
  };
  static #createMenuItems = async (menu_id: number, items: MenuItem[]) => {
    const createMenuItem = async (
      menuId: number,
      itemData: MenuItem,
      pos: number,
      parentId?: number
    ) => {
      const { columns, aliases, values } = queryDataFormat({
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
          menuId,
          parentId,
          itemData.url,
          itemData.page_id,
          itemData.name,
          itemData.target,
          pos,
          itemData.meta,
        ],
      });

      const item = await client.query<MenuItemT>({
        text: `INSERT INTO lucid_menu_items (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
        values: values.value,
      });

      if (itemData.children) {
        await Promise.all(
          itemData.children.map((child, i) =>
            createMenuItem(menuId, child, i, item.rows[0].id)
          )
        );
      }
    };
    await Promise.all(items.map((item, i) => createMenuItem(menu_id, item, i)));
  };
  static #deleteMenuItemsByIds = async (ids: number[]) => {
    const deleted = await client.query<MenuItemT>({
      text: `DELETE FROM lucid_menu_items WHERE id = ANY($1::int[])`,
      values: [ids],
    });

    if (deleted.rowCount !== ids.length) {
      throw new LucidError({
        type: "basic",
        name: "Menu Item Delete Error",
        message: "Menu items could not be deleted",
        status: 500,
      });
    }

    return deleted.rows;
  };
}
