import getDBClient from "@db/db";
// Utils
import { queryDataFormat, SelectQueryBuilder } from "@utils/app/query-helpers";

// -------------------------------------------
// Types
type CategoryGetSingle = (
  environment_key: string,
  id: number
) => Promise<CategoryT>;

type CategoryGetMultiple = (query_instance: SelectQueryBuilder) => Promise<{
  data: CategoryT[];
  count: number;
}>;

type CategoryCreateSingle = (data: {
  environment_key: string;
  collection_key: string;
  title: string;
  slug: string;
  description?: string;
}) => Promise<CategoryT>;

type CategoryUpdateSingle = (
  environment_key: string,
  id: number,
  data: {
    title?: string;
    slug?: string;
    description?: string;
  }
) => Promise<CategoryT>;

type CategoryDeleteSingle = (
  environment_key: string,
  id: number
) => Promise<CategoryT>;

// -------------------------------------------
// User
export type CategoryT = {
  id: number;
  environment_key: string;
  collection_key: string;
  title: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export default class Category {
  // -------------------------------------------
  // Functions
  static getMultiple: CategoryGetMultiple = async (query_instance) => {
    const client = await getDBClient;

    const categories = await client.query<CategoryT>({
      text: `SELECT ${query_instance.query.select} FROM lucid_categories ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
      values: query_instance.values,
    });

    const count = await client.query<{ count: number }>({
      text: `SELECT COUNT(*) FROM lucid_categories ${query_instance.query.where}`,
      values: query_instance.countValues,
    });

    return {
      data: categories.rows,
      count: count.rows[0].count,
    };
  };
  static getSingle: CategoryGetSingle = async (environment_key, id) => {
    const client = await getDBClient;

    const category = await client.query<CategoryT>({
      text: "SELECT * FROM lucid_categories WHERE id = $1 AND environment_key = $2",
      values: [id, environment_key],
    });

    return category.rows[0];
  };
  static createSingle: CategoryCreateSingle = async (data) => {
    const { columns, aliases, values } = queryDataFormat({
      columns: [
        "environment_key",
        "collection_key",
        "title",
        "slug",
        "description",
      ],
      values: [
        data.environment_key,
        data.collection_key,
        data.title,
        data.slug,
        data.description,
      ],
    });

    const client = await getDBClient;
    const res = await client.query<CategoryT>({
      text: `INSERT INTO lucid_categories (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value,
    });

    return res.rows[0];
  };
  static updateSingle: CategoryUpdateSingle = async (
    environment_key,
    id,
    data
  ) => {
    const client = await getDBClient;

    const category = await client.query<CategoryT>({
      name: "update-category",
      text: `UPDATE lucid_categories SET title = COALESCE($1, title), slug = COALESCE($2, slug), description = COALESCE($3, description) WHERE id = $4 AND environment_key = $5 RETURNING *`,
      values: [data.title, data.slug, data.description, id, environment_key],
    });

    return category.rows[0];
  };
  static deleteSingle: CategoryDeleteSingle = async (environment_key, id) => {
    const client = await getDBClient;

    const category = await client.query<CategoryT>({
      name: "delete-category",
      text: `DELETE FROM lucid_categories WHERE id = $1 AND environment_key = $2 RETURNING *`,
      values: [id, environment_key],
    });

    return category.rows[0];
  };
  // -------------------------------------------
  // Util Functions
  static isSlugUniqueInCollection = async (data: {
    collection_key: string;
    slug: string;
    environment_key: string;
    ignore_id?: number;
  }): Promise<boolean> => {
    const client = await getDBClient;

    const values: Array<string | number> = [
      data.collection_key,
      data.slug,
      data.environment_key,
    ];
    if (data.ignore_id) {
      values.push(data.ignore_id);
    }

    const res = await client.query<CategoryT>({
      text: `SELECT * FROM lucid_categories WHERE collection_key = $1 AND slug = $2 AND environment_key = $3 ${
        data.ignore_id ? "AND id != $4" : ""
      }`,
      values: values,
    });
    const category = res.rows[0];
    if (category) {
      return false;
    }
    return true;
  };
}
