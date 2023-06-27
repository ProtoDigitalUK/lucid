import client from "@db/db";
// Utils
import { LucidError, modelErrors } from "@utils/error-handler";
import { queryDataFormat } from "@utils/query-helpers";

// -------------------------------------------
// Types
type MenuCreateSingle = (data: {
  environment_key: string;

  key: string;
  name: string;
  description?: string;
  items?: {
    parent_id?: number;
    url?: string;
    page_id?: number;
    name: string;
    target?: "_self" | "_blank" | "_parent" | "_top";
    position?: number;
    meta?: {};
  }[];
}) => Promise<MenuT>;

// -------------------------------------------
// Menu
export type MenuT = {
  key: string;
  environment_key: string;
  name: string;
  description: string;
};

export type MenuItem = {
  id: number;
  menu_key: MenuT["key"];
  parent_id: string;

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
    // const menu = await client.query<MenuT>({
    //   text: `INSERT INTO lucid_menus (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
    //   values: values.value,
    // });

    // if (!menu.rows[0]) {
    //   throw new LucidError({
    //     type: "basic",
    //     name: "Menu Creation Error",
    //     message: "Menu could not be created",
    //     status: 500,
    //   });
    // }

    // -------------------------------------------
    // Create Menu Items
    if (data.items) {
      const { columns, aliases, values } = queryDataFormat({
        columns: [
          "menu_key",
          "parent_id",
          "url",
          "page_id",
          "name",
          "target",
          "position",
          "meta",
        ],
        values: [],
      });
    }

    // return menu.rows[0];
    return {} as MenuT;
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
