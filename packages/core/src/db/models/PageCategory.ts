import { PoolClient } from "pg";

// -------------------------------------------
// Types

type PageCategoryCreate = (
  client: PoolClient,
  data: {
    page_id: number;
    category_ids: Array<number>;
  }
) => Promise<Array<PageCategoryT>>;

type PageCategoryGetMultiple = (
  client: PoolClient,
  data: {
    category_ids: Array<number>;
    collection_key: string;
  }
) => Promise<Array<PageCategoryT>>;

type PageCategoryDelete = (
  client: PoolClient,
  data: {
    page_id: number;
    category_ids: Array<number>;
  }
) => Promise<Array<PageCategoryT>>;

type PageCategoryGetMultipleByPageId = (
  client: PoolClient,
  data: {
    page_id: number;
  }
) => Promise<Array<PageCategoryT>>;

// -------------------------------------------
// Page Category
export type PageCategoryT = {
  page_id: number;
  category_id: number;
  id: number;
};

export default class PageCategory {
  static createMultiple: PageCategoryCreate = async (client, data) => {
    const categories = await client.query<PageCategoryT>({
      text: `INSERT INTO lucid_page_categories (page_id, category_id) SELECT $1, id FROM lucid_categories WHERE id = ANY($2) RETURNING *`,
      values: [data.page_id, data.category_ids],
    });

    return categories.rows;
  };
  static getMultiple: PageCategoryGetMultiple = async (client, data) => {
    const res = await client.query<PageCategoryT>({
      text: `SELECT * FROM lucid_categories WHERE id = ANY($1) AND collection_key = $2`,
      values: [data.category_ids, data.collection_key],
    });

    return res.rows;
  };
  static getMultipleByPageId: PageCategoryGetMultipleByPageId = async (
    client,
    data
  ) => {
    const res = await client.query<PageCategoryT>({
      text: `SELECT * FROM lucid_page_categories WHERE page_id = $1`,
      values: [data.page_id],
    });

    return res.rows;
  };
  static deleteMultiple: PageCategoryDelete = async (client, data) => {
    const deleteCategories = await client.query<PageCategoryT>({
      text: `DELETE FROM lucid_page_categories WHERE page_id = $1 AND category_id = ANY($2) RETURNING *`,
      values: [data.page_id, data.category_ids],
    });

    return deleteCategories.rows;
  };
}
