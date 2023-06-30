import client from "@db/db";
// Utils
import { LucidError, modelErrors } from "@utils/error-handler";
import { queryDataFormat } from "@utils/query-helpers";
// Schema
import { MenuItem } from "@schemas/menus";

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
}) => Promise<MenuT>;

// -------------------------------------------
// Menu
export type MenuT = {
  id: number;
  key: string;
  environment_key: string;
  name: string;
  description: string;
};

export type MenuItemT = {
  id: number;
  menu_id: MenuT["key"];

  parent_id?: string;
  url?: string;
  page_id?: number;

  name: string;
  target: "_self" | "_blank" | "_parent" | "_top";
  position: number;
  meta: {};
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

        await Promise.all(
          data.items.map((item, i) => createMenuItem(menu.rows[0].id, item, i))
        );
      } catch (err) {
        await client.query({
          text: `DELETE FROM lucid_menus WHERE id = $1`,
          values: [menu.rows[0].id],
        });
        throw err;
      }
    }

    // -------------------------------------------
    // Return Menu
    return menu.rows[0];
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
    const menu = await client.query<MenuT>({
      text: `SELECT 
          m.*, 
          COALESCE(json_agg(
            json_build_object(
              'id', mi.id,
              'menu_id', mi.menu_id,
              'parent_id', mi.parent_id,
              'page_id', mi.page_id,
              'name', mi.name,
              'url', mi.url,
              'target', mi.target,
              'position', mi.position,
              'meta', mi.meta
            ) 
          ) FILTER (WHERE mi.id IS NOT NULL), '[]') AS items
        FROM 
          lucid_menus m
        LEFT JOIN 
          lucid_menu_items mi ON m.id = mi.menu_id
        WHERE 
          m.id = $1 AND m.environment_key = $2
        GROUP BY 
          m.id, m.environment_key, m.key, m.name, m.description, m.created_at, m.updated_at;`,
      values: [data.id, data.environment_key],
    });

    if (!menu.rows[0]) {
      throw new LucidError({
        type: "basic",
        name: "Menu Get Error",
        message: "Menu could not be found",
        status: 404,
      });
    }

    return menu.rows[0];
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
}
