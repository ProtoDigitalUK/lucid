import client from "@db/db";
import { z } from "zod";
// Models
import Collection from "@db/models/Collection";
// Utils
import { LucidError, modelErrors } from "@utils/error-handler";
import { queryDataFormat, SelectQueryBuilder } from "@utils/query-helpers";
// Schema
import categorySchema from "@schemas/categories";

// -------------------------------------------
// Types
type CategoryGetSingle = (
  environment_key: string,
  id: number
) => Promise<CategoryT>;

type CategoryGetMultiple = (
  environment_key: string,
  query: z.infer<typeof categorySchema.getMultiple.query>
) => Promise<{
  data: CategoryT[];
  count: number;
}>;
type CategoryCreate = (data: {
  environment_key: string;
  collection_key: string;
  title: string;
  slug: string;
  description?: string;
}) => Promise<CategoryT>;

type CategoryUpdate = (
  environment_key: string,
  id: number,
  data: {
    title?: string;
    slug?: string;
    description?: string;
  }
) => Promise<CategoryT>;

type CategoryDelete = (
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
  // Methods
  static getMultiple: CategoryGetMultiple = async (environment_key, query) => {
    const { filter, sort, page, per_page } = query;

    // Build Query Data and Query
    const SelectQuery = new SelectQueryBuilder({
      columns: [
        "id",
        "environment_key",
        "collection_key",
        "title",
        "slug",
        "description",
        "created_at",
        "updated_at",
      ],
      exclude: undefined,
      filter: {
        data: {
          ...filter,
          environment_key: environment_key,
        },
        meta: {
          collection_key: {
            operator: "=",
            type: "string",
            columnType: "standard",
          },
          title: {
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

    // Get Categories
    const categories = await client.query<CategoryT>({
      text: `SELECT ${SelectQuery.query.select} FROM lucid_categories ${SelectQuery.query.where} ${SelectQuery.query.order} ${SelectQuery.query.pagination}`,
      values: SelectQuery.values,
    });

    const count = await client.query<{ count: number }>({
      text: `SELECT COUNT(*) FROM lucid_categories ${SelectQuery.query.where}`,
      values: SelectQuery.countValues,
    });

    return {
      data: categories.rows,
      count: count.rows[0].count,
    };
  };
  static getSingle: CategoryGetSingle = async (environment_key, id) => {
    const category = await client.query<CategoryT>({
      text: "SELECT * FROM lucid_categories WHERE id = $1 AND environment_key = $2",
      values: [id, environment_key],
    });

    if (!category.rows[0]) {
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
        }),
      });
    }

    return category.rows[0];
  };
  static create: CategoryCreate = async (data) => {
    // -------------------------------------------
    // Checks
    await Collection.getSingle(
      data.collection_key,
      "pages",
      data.environment_key
    );

    // check if slug is unique in post type
    const isSlugUnique = await Category.isSlugUniqueInCollection({
      collection_key: data.collection_key,
      slug: data.slug,
      environment_key: data.environment_key,
    });
    if (!isSlugUnique) {
      throw new LucidError({
        type: "basic",
        name: "Category Not Created",
        message: "Please provide a unique slug within this post type.",
        status: 400,
        errors: modelErrors({
          slug: {
            code: "not_unique",
            message: "Please provide a unique slug within this post type.",
          },
        }),
      });
    }

    const { columns, aliases, values } = queryDataFormat(
      ["environment_key", "collection_key", "title", "slug", "description"],
      [
        data.environment_key,
        data.collection_key,
        data.title,
        data.slug,
        data.description,
      ]
    );

    const res = await client.query<CategoryT>({
      name: "create-category",
      text: `INSERT INTO lucid_categories (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value,
    });
    const category = res.rows[0];
    if (!category) {
      throw new LucidError({
        type: "basic",
        name: "Category Not Created",
        message: "There was an error creating the category.",
        status: 500,
      });
    }

    return category;
  };
  static update: CategoryUpdate = async (environment_key, id, data) => {
    // Check if category exists
    const currentCategory = await Category.getSingle(environment_key, id);

    if (data.slug) {
      const isSlugUnique = await Category.isSlugUniqueInCollection({
        collection_key: currentCategory.collection_key,
        slug: data.slug,
        environment_key: environment_key,
        ignore_id: id,
      });
      if (!isSlugUnique) {
        throw new LucidError({
          type: "basic",
          name: "Category Not Updated",
          message: "Please provide a unique slug within this post type.",
          status: 400,
          errors: modelErrors({
            slug: {
              code: "not_unique",
              message: "Please provide a unique slug within this post type.",
            },
          }),
        });
      }
    }

    const category = await client.query<CategoryT>({
      name: "update-category",
      text: `UPDATE lucid_categories SET title = COALESCE($1, title), slug = COALESCE($2, slug), description = COALESCE($3, description) WHERE id = $4 AND environment_key = $5 RETURNING *`,
      values: [data.title, data.slug, data.description, id, environment_key],
    });
    if (!category.rows[0]) {
      throw new LucidError({
        type: "basic",
        name: "Category Not Updated",
        message: "There was an error updating the category.",
        status: 500,
      });
    }

    return category.rows[0];
  };
  static delete: CategoryDelete = async (environment_key, id) => {
    const category = await client.query<CategoryT>({
      name: "delete-category",
      text: `DELETE FROM lucid_categories WHERE id = $1 AND environment_key = $2 RETURNING *`,
      values: [id, environment_key],
    });

    if (!category.rows[0]) {
      throw new LucidError({
        type: "basic",
        name: "Category Not Deleted",
        message: "There was an error deleting the category.",
        status: 500,
      });
    }

    return category.rows[0];
  };
  // -------------------------------------------
  // Util Methods
  static isSlugUniqueInCollection = async (data: {
    collection_key: string;
    slug: string;
    environment_key: string;
    ignore_id?: number;
  }): Promise<boolean> => {
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
