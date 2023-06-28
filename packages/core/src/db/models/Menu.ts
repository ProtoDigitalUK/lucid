import client from "@db/db";
// Utils
import { LucidError, modelErrors } from "@utils/error-handler";
import { queryDataFormat } from "@utils/query-helpers";

// -------------------------------------------
// Types
type MenuCreateSingle = (data: {
  environment_key: string;

  id: number;
  key: string;
  name: string;
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
};

export type MenuItem = {
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
    try {
      if (data.items) {
        const { columns, aliases, values } = queryDataFormat({
          columns: [
            "menu_id",
            "parent_id",
            "page_id",
            "name",
            "url",
            "target",
            "position",
            "meta",
          ],
          values: data.items.flatMap((item) => [
            menu.rows[0].id,
            item.parent_id || null,
            item.page_id || null,
            item.name,
            item.url || null,
            item.target,
            item.position || 0,
            item.meta || {},
          ]),
          flatValues: true,
        });

        const menuItems = await client.query<MenuItem>({
          text: `INSERT INTO lucid_menu_items (${columns.formatted.insertMultiple}) VALUES ${aliases.formatted.insertMultiple} RETURNING *`,
          values: values.formatted.insertMultiple,
        });

        if (menuItems.rows.length !== data.items.length) {
          throw new LucidError({
            type: "basic",
            name: "Menu Item Creation Error",
            message: "Menu Items could not be created",
            status: 500,
          });
        }
      }
    } catch (err) {
      await client.query({
        text: `DELETE FROM lucid_menus WHERE id = $1`,
        values: [menu.rows[0].id],
      });
      throw err;
    }

    // -------------------------------------------
    // Return Menu
    return {
      id: menu.rows[0].id,
      key: menu.rows[0].key,
      environment_key: menu.rows[0].environment_key,
      name: menu.rows[0].name,
      description: menu.rows[0].description,
      items: data.items,
    };
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
