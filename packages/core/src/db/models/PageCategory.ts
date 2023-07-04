import getDBClient from "@db/db";
import { LucidError, modelErrors } from "@utils/error-handler";

// -------------------------------------------
// Types

type PageCategoryCreate = (data: {
  page_id: number;
  category_ids: Array<number>;
  collection_key: string;
}) => Promise<Array<PageCategoryT>>;

type PageCategoryDelete = (data: {
  page_id: number;
  category_ids: Array<number>;
}) => Promise<Array<PageCategoryT>>;

type PageCategoryUpdate = (data: {
  page_id: number;
  category_ids: Array<number>; // all categories to be associated with the page
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
  // Functions
  static create: PageCategoryCreate = async (data) => {
    const client = await getDBClient;

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
  static delete: PageCategoryDelete = async (data) => {
    const client = await getDBClient;

    const { page_id, category_ids } = data;

    const deleteCategories = await client.query<PageCategoryT>({
      text: `DELETE FROM lucid_page_categories WHERE page_id = $1 AND category_id = ANY($2) RETURNING *`,
      values: [page_id, category_ids],
    });

    if (deleteCategories.rowCount !== category_ids.length) {
      throw new LucidError({
        type: "basic",
        name: "Page Category Not Deleted",
        message: "There was an error deleting the page category.",
        status: 500,
      });
    }

    return deleteCategories.rows;
  };
  static update: PageCategoryUpdate = async (data) => {
    const client = await getDBClient;

    const { page_id, category_ids, collection_key } = data;

    // get all page_categories for the page
    const pageCategoriesRes = await client.query<PageCategoryT>({
      text: `SELECT * FROM lucid_page_categories WHERE page_id = $1`,
      values: [page_id],
    });

    // Categories to add
    const categoriesToAdd = category_ids.filter(
      (id) =>
        !pageCategoriesRes.rows.find(
          (pageCategory) => pageCategory.category_id === id
        )
    );

    // Categories to remove
    const categoriesToRemove = pageCategoriesRes.rows.filter(
      (pageCategory) => !category_ids.includes(pageCategory.category_id)
    );

    // Add categories
    const updatePromise = [];
    if (categoriesToAdd.length > 0) {
      updatePromise.push(
        PageCategory.create({
          page_id,
          category_ids: categoriesToAdd,
          collection_key,
        })
      );
    }
    if (categoriesToRemove.length > 0) {
      updatePromise.push(
        PageCategory.delete({
          page_id,
          category_ids: categoriesToRemove.map(
            (category) => category.category_id
          ),
        })
      );
    }

    const updateRes = await Promise.all(updatePromise);

    const newPageCategories = pageCategoriesRes.rows.filter(
      (pageCategory) => !categoriesToRemove.includes(pageCategory)
    );

    if (categoriesToAdd.length > 0) {
      newPageCategories.push(...updateRes[0]);
    }

    return newPageCategories;
  };
  // -------------------------------------------
  // Util Functions
  static checkCategoryPostType = async (
    category_ids: Array<number>,
    collection_key: string
  ) => {
    const client = await getDBClient;

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
