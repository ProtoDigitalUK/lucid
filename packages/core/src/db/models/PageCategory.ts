import client from "@db/db";
import { LucidError, modelErrors } from "@utils/error-handler";

// -------------------------------------------
// Types

type PageCategoryCreate = (data: {
  page_id: number;
  category_ids: Array<number>;
  collection_key: string;
}) => Promise<Array<PageCategoryT>>;

// -------------------------------------------
// User
export type PageCategoryT = {
  page_id: number;
  category_id: number;
  id: number;
};

export default class PageCategory {
  // -------------------------------------------
  // Methods
  static create: PageCategoryCreate = async (data) => {
    const { page_id, category_ids, collection_key } = data;

    await PageCategory.checkCategoryPostType(category_ids, collection_key);

    const categories = await client.query<PageCategoryT>({
      text: `INSERT INTO lucid_page_categories (page_id, category_id) SELECT $1, id FROM lucid_categories WHERE id = ANY($2) RETURNING *`,
      values: [page_id, category_ids],
    });

    if (categories.rowCount !== category_ids.length) {
      throw new LucidError({
        type: "basic",
        name: "Page Category Not Created",
        message: "There was an error creating the page category.",
        status: 500,
      });
    }

    return categories.rows;
  };
  // -------------------------------------------
  // Util Methods
  static checkCategoryPostType = async (
    category_ids: Array<number>,
    collection_key: string
  ) => {
    const res = await client.query<{ id: number }>({
      text: `SELECT id FROM lucid_categories WHERE id = ANY($1) AND collection_key = $2`,
      values: [category_ids, collection_key],
    });

    if (res.rows.length !== category_ids.length) {
      throw new LucidError({
        type: "basic",
        name: "Category Not Found",
        message: "Category not found.",
        status: 404,
        errors: modelErrors({
          id: {
            code: "not_found",
            message: "Category not found.",
          },
          collection_key: {
            code: "not_found",
            message: "Collection key not found.",
          },
        }),
      });
    }
  };
}
