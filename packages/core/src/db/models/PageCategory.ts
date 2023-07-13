import getDBClient from "@db/db";

// -------------------------------------------
// Types

type PageCategoryCreate = (data: {
  page_id: number;
  category_ids: Array<number>;
}) => Promise<Array<PageCategoryT>>;

type PageCategoryDelete = (data: {
  page_id: number;
  category_ids: Array<number>;
}) => Promise<Array<PageCategoryT>>;

// -------------------------------------------
// Page Category
export type PageCategoryT = {
  page_id: number;
  category_id: number;
  id: number;
};

export default class PageCategory {
  static createMultiple: PageCategoryCreate = async (data) => {
    const client = await getDBClient;

    const categories = await client.query<PageCategoryT>({
      text: `INSERT INTO lucid_page_categories (page_id, category_id) SELECT $1, id FROM lucid_categories WHERE id = ANY($2) RETURNING *`,
      values: [data.page_id, data.category_ids],
    });

    return categories.rows;
  };
  static getMultiple = async (
    category_ids: Array<number>,
    collection_key: string
  ) => {
    const client = await getDBClient;

    const res = await client.query<{ id: number }>({
      text: `SELECT id FROM lucid_categories WHERE id = ANY($1) AND collection_key = $2`,
      values: [category_ids, collection_key],
    });

    return res.rows;
  };
  static getMultipleByPageId = async (page_id: number) => {
    const client = await getDBClient;

    const res = await client.query<PageCategoryT>({
      text: `SELECT * FROM lucid_page_categories WHERE page_id = $1`,
      values: [page_id],
    });

    return res.rows;
  };
  static deleteMultiple: PageCategoryDelete = async (data) => {
    const client = await getDBClient;

    const deleteCategories = await client.query<PageCategoryT>({
      text: `DELETE FROM lucid_page_categories WHERE page_id = $1 AND category_id = ANY($2) RETURNING *`,
      values: [data.page_id, data.category_ids],
    });

    return deleteCategories.rows;
  };
}
