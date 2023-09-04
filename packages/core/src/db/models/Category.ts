import { PoolClient } from "pg";
// Utils
import { queryDataFormat, SelectQueryBuilder } from "@utils/app/query-helpers";

// -------------------------------------------
// Types
type CategoryGetSingle = (
  client: PoolClient,
  data: {
    environment_key: string;
    id: number;
  }
) => Promise<CategoryT>;

type CategoryGetMultiple = (
  client: PoolClient,
  query_instance: SelectQueryBuilder
) => Promise<{
  data: CategoryT[];
  count: number;
}>;

type CategoryCreateSingle = (
  client: PoolClient,
  data: {
    environment_key: string;
    collection_key: string;
    title: string;
    slug: string;
    description?: string;
  }
) => Promise<CategoryT>;

type CategoryUpdateSingle = (
  client: PoolClient,
  data: {
    environment_key: string;
    id: number;
    title?: string;
    slug?: string;
    description?: string;
  }
) => Promise<CategoryT>;

type CategoryDeleteSingle = (
  client: PoolClient,
  data: {
    environment_key: string;
    id: number;
  }
) => Promise<CategoryT>;

type CategoryIsSlugUniqueInCollection = (
  client: PoolClient,
  data: {
    collection_key: string;
    slug: string;
    environment_key: string;
    ignore_id?: number;
  }
) => Promise<boolean>;

// -------------------------------------------
// Category
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
  static getMultiple: CategoryGetMultiple = async (client, query_instance) => {
    const categories = client.query<CategoryT>({
      text: `SELECT ${query_instance.query.select} FROM lucid_categories ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
      values: query_instance.values,
    });

    const count = client.query<{ count: string }>({
      text: `SELECT COUNT(*) FROM lucid_categories ${query_instance.query.where}`,
      values: query_instance.countValues,
    });

    const data = await Promise.all([categories, count]);

    return {
      data: data[0].rows,
      count: Number(data[1].rows[0].count),
    };
  };
  static getSingle: CategoryGetSingle = async (client, data) => {
    const category = await client.query<CategoryT>({
      text: "SELECT * FROM lucid_categories WHERE id = $1 AND environment_key = $2",
      values: [data.id, data.environment_key],
    });

    return category.rows[0];
  };
  static createSingle: CategoryCreateSingle = async (client, data) => {
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

    const res = await client.query<CategoryT>({
      text: `INSERT INTO lucid_categories (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value,
    });

    return res.rows[0];
  };
  static updateSingle: CategoryUpdateSingle = async (client, data) => {
    const category = await client.query<CategoryT>({
      name: "update-category",
      text: `UPDATE lucid_categories SET title = COALESCE($1, title), slug = COALESCE($2, slug), description = COALESCE($3, description) WHERE id = $4 AND environment_key = $5 RETURNING *`,
      values: [
        data.title,
        data.slug,
        data.description,
        data.id,
        data.environment_key,
      ],
    });

    return category.rows[0];
  };
  static deleteSingle: CategoryDeleteSingle = async (client, data) => {
    const category = await client.query<CategoryT>({
      name: "delete-category",
      text: `DELETE FROM lucid_categories WHERE id = $1 AND environment_key = $2 RETURNING *`,
      values: [data.id, data.environment_key],
    });

    return category.rows[0];
  };
  static isSlugUniqueInCollection: CategoryIsSlugUniqueInCollection = async (
    client,
    data
  ) => {
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
