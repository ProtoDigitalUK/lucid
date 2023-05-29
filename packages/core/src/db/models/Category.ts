import client from "@db/db";
import { Request } from "express";
import { LucidError, modelErrors } from "@utils/error-handler";
// Serivces
import QueryBuilder from "@services/models/QueryBuilder";

// -------------------------------------------
// Types
interface QueryParams extends ModelQueryParams {
  filter?: {
    post_type_id?: string;
    title?: string;
  };
  sort?: Array<{
    key: "created_at" | "title";
    value: "asc" | "desc";
  }>;
  page?: string;
  per_page?: string;
}

type CategoryGetMultiple = (req: Request) => Promise<{
  data: CategoryT[];
  count: number;
}>;
type CategoryCreate = (data: {
  post_type_id: number;
  title: string;
  slug: string;
  description?: string;
}) => Promise<CategoryT>;

// -------------------------------------------
// User
export type CategoryT = {
  id: number;
  post_type_id: number;
  title: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export default class Category {
  // -------------------------------------------
  // Methods
  static getMultiple: CategoryGetMultiple = async (req) => {
    const { filter, sort, page, per_page } = req.query as QueryParams;

    // Build Query Data and Query
    const QueryB = new QueryBuilder({
      columns: [
        "id",
        "post_type_id",
        "title",
        "slug",
        "description",
        "created_at",
        "updated_at",
      ],
      exclude: undefined,
      filter: {
        data: filter,
        meta: {
          post_type_id: {
            operator: "=",
            type: "int",
          },
          title: {
            operator: "ILIKE",
            type: "string",
          },
        },
      },
      sort: sort,
      page: page,
      per_page: per_page,
    });
    const { select, where, order, pagination } = QueryB.query;

    // Get Categories
    const categories = await client.query<CategoryT>({
      text: `SELECT ${select} FROM lucid_categories ${where} ${order} ${pagination}`,
      values: QueryB.values,
    });

    const count = await client.query<{ count: number }>({
      text: `SELECT COUNT(*) FROM lucid_categories ${where}`,
      values: QueryB.countValues,
    });

    return {
      data: categories.rows,
      count: count.rows[0].count,
    };
  };
  static create: CategoryCreate = async (data) => {
    // check if slug is unique in post type
    const isSlugUnique = await Category.isSlugUniqueInPostType(
      data.post_type_id,
      data.slug
    );
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

    const res = await client.query<CategoryT>({
      name: "create-category",
      text: `INSERT INTO lucid_categories(post_type_id, title, slug, description) VALUES($1, $2, $3, $4) RETURNING *`,
      values: [data.post_type_id, data.title, data.slug, data.description],
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
  // -------------------------------------------
  // Util Methods
  static isSlugUniqueInPostType = async (
    post_type_id: number,
    slug: string
  ): Promise<boolean> => {
    const res = await client.query<CategoryT>({
      name: "is-slug-unique-in-post-type",
      text: `SELECT * FROM lucid_categories WHERE post_type_id = $1 AND slug = $2`,
      values: [post_type_id, slug],
    });
    const category = res.rows[0];
    if (category) {
      return false;
    }
    return true;
  };
}
