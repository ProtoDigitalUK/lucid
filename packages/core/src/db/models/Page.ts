import z from "zod";
import getDBClient from "@db/db";
import slugify from "slugify";
// Models
import PageCategory from "@db/models/PageCategory";
import Collection from "@db/models/Collection";
import CollectionBrick, { BrickObject } from "@db/models/CollectionBrick";
import Environment from "@db/models/Environment";
// Serivces
import formatPage from "@utils/pages/format-page";
import { BrickResponseT } from "@utils/bricks/format-bricks";
import validateBricks from "@utils/bricks/validate-bricks";
import { LucidError } from "@utils/app/error-handler";
import { queryDataFormat, SelectQueryBuilder } from "@utils/app/query-helpers";
// Schema
import pagesSchema from "@schemas/pages";

// -------------------------------------------
// Types
type PageGetMultiple = (
  query: z.infer<typeof pagesSchema.getMultiple.query>,
  data: {
    environment_key: string;
  }
) => Promise<{
  data: PageT[];
  count: number;
}>;

type PageGetSingle = (
  query: z.infer<typeof pagesSchema.getSingle.query>,
  data: {
    environment_key: string;
    id: number;
  }
) => Promise<PageT>;

type PageCreateSingle = (data: {
  userId: number;
  environment_key: string;
  title: string;
  slug: string;
  collection_key: string;
  homepage?: boolean;
  excerpt?: string;
  published?: boolean;
  parent_id?: number;
  category_ids?: Array<number>;
}) => Promise<PageT>;

type PageUpdateSingle = (data: {
  id: number;
  environment_key: string;
  userId: number;

  title?: string;
  slug?: string;
  homepage?: boolean;
  parent_id?: number;
  category_ids?: Array<number>;
  published?: boolean;
  excerpt?: string;
  builder_bricks?: Array<BrickObject>;
  fixed_bricks?: Array<BrickObject>;
}) => Promise<PageT>;

type PageDeleteSingle = (data: {
  environment_key: string;
  id: number;
}) => Promise<PageT>;

type PageGetMultipleByIds = (data: {
  ids: Array<number>;
  environment_key: string;
}) => Promise<PageT[]>;

// -------------------------------------------
// User
export type PageT = {
  id: number;
  environment_key: string;
  parent_id: number | null;
  collection_key: string;

  title: string;
  slug: string;
  full_slug: string;
  homepage: boolean;
  excerpt: string | null;
  categories?: Array<number> | null;

  builder_bricks?: Array<BrickResponseT> | null;
  fixed_bricks?: Array<BrickResponseT> | null;

  published: boolean;
  published_at: string | null;
  published_by: number | null;

  created_by: number | null;
  created_at: string;
  updated_at: string;
};

export default class Page {
  // -------------------------------------------
  // Functions
  static getMultiple: PageGetMultiple = async (query, data) => {
    const client = await getDBClient;

    const { filter, sort, page, per_page } = query;

    // Build Query Data and Query
    const SelectQuery = new SelectQueryBuilder({
      columns: [
        "id",
        "environment_key",
        "collection_key",
        "parent_id",
        "title",
        "slug",
        "full_slug",
        "homepage",
        "excerpt",
        "published",
        "published_at",
        "published_by",
        "created_by",
        "created_at",
        "updated_at",
      ],
      exclude: undefined,
      filter: {
        data: {
          ...filter,
          environment_key: data.environment_key,
        },
        meta: {
          collection_key: {
            operator: "=",
            type: "text",
            columnType: "standard",
          },
          title: {
            operator: "%",
            type: "text",
            columnType: "standard",
          },
          slug: {
            operator: "%",
            type: "text",
            columnType: "standard",
          },
          category_id: {
            operator: "=",
            type: "int",
            columnType: "standard",
            table: "lucid_page_categories",
          },
          environment_key: {
            operator: "=",
            type: "text",
            columnType: "standard",
          },
        },
      },
      sort: sort,
      page: page,
      per_page: per_page,
    });

    const pages = await client.query<PageT>({
      text: `SELECT
          ${SelectQuery.query.select},
          COALESCE(json_agg(lucid_page_categories.category_id), '[]') AS categories
        FROM
          lucid_pages
        LEFT JOIN
          lucid_page_categories ON lucid_page_categories.page_id = lucid_pages.id
        ${SelectQuery.query.where}
        GROUP BY lucid_pages.id
        ${SelectQuery.query.order}
        ${SelectQuery.query.pagination}`,
      values: SelectQuery.values,
    });

    const count = await client.query<{ count: number }>({
      text: `SELECT 
          COUNT(DISTINCT lucid_pages.id)
        FROM
          lucid_pages
        LEFT JOIN 
          lucid_page_categories ON lucid_page_categories.page_id = lucid_pages.id
        ${SelectQuery.query.where}
        `,
      values: SelectQuery.countValues,
    });

    // format pages
    pages.rows.forEach((page) => {
      page = formatPage(page);
    });

    return {
      data: pages.rows,
      count: count.rows[0].count,
    };
  };
  static getSingle: PageGetSingle = async (query, data) => {
    const client = await getDBClient;

    const { include } = query;

    // Build Query Data and Query
    const SelectQuery = new SelectQueryBuilder({
      columns: [
        "id",
        "environment_key",
        "collection_key",
        "parent_id",
        "title",
        "slug",
        "full_slug",
        "homepage",
        "excerpt",
        "published",
        "published_at",
        "published_by",
        "created_by",
        "created_at",
        "updated_at",
      ],
      exclude: undefined,
      filter: {
        data: {
          id: data.id.toString(),
          environment_key: data.environment_key,
        },
        meta: {
          id: {
            operator: "=",
            type: "int",
            columnType: "standard",
          },
          environment_key: {
            operator: "=",
            type: "text",
            columnType: "standard",
          },
        },
      },
      sort: undefined,
      page: undefined,
      per_page: undefined,
    });

    const page = await client.query<PageT>({
      text: `SELECT
        ${SelectQuery.query.select},
        COALESCE(json_agg(lucid_page_categories.category_id), '[]') AS categories
        FROM
          lucid_pages
        LEFT JOIN
          lucid_page_categories ON lucid_page_categories.page_id = lucid_pages.id
        ${SelectQuery.query.where}
        GROUP BY lucid_pages.id`,
      values: SelectQuery.values,
    });

    if (page.rows.length === 0) {
      throw new LucidError({
        type: "basic",
        name: "Page not found",
        message: `Page with id "${data.id}" not found`,
        status: 404,
      });
    }

    if (include && include.includes("bricks")) {
      const collection = await Collection.getSingle({
        collection_key: page.rows[0].collection_key,
        environment_key: page.rows[0].environment_key,
        type: "pages",
      });

      const pageBricks = await CollectionBrick.getAll({
        reference_id: page.rows[0].id,
        type: "pages",
        environment_key: data.environment_key,
        collection: collection,
      });
      page.rows[0].builder_bricks = pageBricks.builder_bricks;
      page.rows[0].fixed_bricks = pageBricks.fixed_bricks;
    }

    return formatPage(page.rows[0]);
  };
  static createSingle: PageCreateSingle = async (data) => {
    const client = await getDBClient;

    // -------------------------------------------
    // Values
    // Set parent id to null if homepage as homepage has to be root level
    const parentId = data.homepage ? undefined : data.parent_id || undefined;

    // -------------------------------------------
    // Checks

    // Checks if we have access to the collection
    await Collection.getSingle({
      collection_key: data.collection_key,
      environment_key: data.environment_key,
      type: "pages",
    });

    // Check if the the parent_id is the homepage
    await Page.#checkParentNotHomepage({
      parent_id: data.parent_id || null,
      environment_key: data.environment_key,
    });

    // Check if the parent is in the same collection
    if (parentId) {
      await Page.#isParentSameCollection({
        parent_id: parentId,
        collection_key: data.collection_key,
        environment_key: data.environment_key,
      });
    }
    // Check if slug is unique
    const slug = await Page.#slugUnique({
      slug: data.slug,
      homepage: data.homepage || false,
      environment_key: data.environment_key,
      collection_key: data.collection_key,
      parent_id: parentId,
    });

    // -------------------------------------------
    // Create page
    const page = await client.query<PageT>({
      text: `INSERT INTO lucid_pages (environment_key, title, slug, homepage, collection_key, excerpt, published, parent_id, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      values: [
        data.environment_key,
        data.title,
        slug,
        data.homepage || false,
        data.collection_key,
        data.excerpt || null,
        data.published || false,
        parentId,
        data.userId,
      ],
    });

    if (!page.rows[0]) {
      throw new LucidError({
        type: "basic",
        name: "Page Not Created",
        message: "There was an error creating the page",
        status: 500,
      });
    }

    if (data.category_ids) {
      await PageCategory.create({
        page_id: page.rows[0].id,
        category_ids: data.category_ids,
        collection_key: data.collection_key,
      });
    }

    // Reset homepages
    if (data.homepage) {
      await Page.#resetHomepages({
        current: page.rows[0].id,
        environment_key: data.environment_key,
      });
    }

    return formatPage(page.rows[0]);
  };
  static updateSingle: PageUpdateSingle = async (data) => {
    const client = await getDBClient;

    // -------------------------------------------
    // Checks
    const currentPage = await Page.pageExists(data.id, data.environment_key);

    // Set parent id to null if homepage as homepage has to be root level
    const parentId = data.homepage ? undefined : data.parent_id || undefined;

    // Check if the the parent_id is the homepage
    await Page.#checkParentNotHomepage({
      parent_id: data.parent_id || null,
      environment_key: data.environment_key,
    });
    // Check if the parent is in the same collection
    if (parentId) {
      await Page.#isParentSameCollection({
        parent_id: parentId,
        collection_key: currentPage.collection_key,
        environment_key: data.environment_key,
      });
    }

    //
    // validate bricks
    const environment = await Environment.getSingle(data.environment_key);
    const collection = await Collection.getSingle({
      collection_key: currentPage.collection_key,
      environment_key: data.environment_key,
      type: "pages",
    });

    await validateBricks({
      builder_bricks: data.builder_bricks || [],
      fixed_bricks: data.fixed_bricks || [],
      collection: collection,
      environment: environment,
    });

    // -------------------------------------------
    // Set Data
    let newSlug = undefined;
    if (data.slug) {
      // Check if slug is unique
      newSlug = await Page.#slugUnique({
        slug: data.slug,
        homepage: data.homepage || false,
        environment_key: data.environment_key,
        collection_key: currentPage.collection_key,
        parent_id: parentId,
      });
    }

    const { columns, aliases, values } = queryDataFormat({
      columns: [
        "title",
        "slug",
        "excerpt",
        "published",
        "published_at",
        "published_by",
        "parent_id",
        "homepage",
      ],
      values: [
        data.title,
        newSlug,
        data.excerpt,
        data.published,
        data.published ? new Date() : null,
        data.published ? data.userId : null,
        parentId,
        data.homepage,
      ],
      conditional: {
        hasValues: {
          updated_at: new Date().toISOString(),
        },
      },
    });

    // -------------------------------------------
    // Update page
    const page = await client.query<PageT>({
      text: `UPDATE lucid_pages SET ${columns.formatted.update} WHERE id = $${
        aliases.value.length + 1
      } RETURNING *`,
      values: [...values.value, data.id],
    });

    if (!page.rows[0]) {
      throw new LucidError({
        type: "basic",
        name: "Page Not Updated",
        message: "There was an error updating the page",
        status: 500,
      });
    }

    // -------------------------------------------
    // Update categories
    if (data.category_ids) {
      const categories = await PageCategory.update({
        page_id: page.rows[0].id,
        category_ids: data.category_ids,
        collection_key: currentPage.collection_key,
      });
      page.rows[0].categories = categories.map(
        (category) => category.category_id
      );
    }

    // -------------------------------------------
    // Update/Create Bricks
    await Collection.updateBricks({
      id: page.rows[0].id,
      builder_bricks: data.builder_bricks || [],
      fixed_bricks: data.fixed_bricks || [],
      collection: collection,
      environment: environment,
    });

    // -------------------------------------------
    // Format and return
    return formatPage(page.rows[0]);
  };
  static deleteSingle: PageDeleteSingle = async (data) => {
    const client = await getDBClient;

    // -------------------------------------------
    // Checks
    await Page.pageExists(data.id, data.environment_key);

    // -------------------------------------------
    // Delete page
    const page = await client.query<PageT>({
      text: `DELETE FROM lucid_pages WHERE id = $1 RETURNING *`,
      values: [data.id],
    });

    if (!page.rows[0]) {
      throw new LucidError({
        type: "basic",
        name: "Page Not Deleted",
        message: "There was an error deleting the page",
        status: 500,
      });
    }

    return formatPage(page.rows[0]);
  };
  static getMultipleByIds: PageGetMultipleByIds = async (data) => {
    const client = await getDBClient;

    const pages = await client.query<PageT>({
      text: `SELECT * FROM lucid_pages WHERE id = ANY($1) AND environment_key = $2`,
      values: [data.ids, data.environment_key],
    });

    return pages.rows.map((page) => formatPage(page));
  };
  // -------------------------------------------
  // Util Functions
  static pageExists = async (id: number, environment_key: string) => {
    const client = await getDBClient;

    const page = await client.query<PageT>({
      text: `SELECT
          id,
          collection_key
        FROM
          lucid_pages
        WHERE
          id = $1
        AND
          environment_key = $2`,
      values: [id, environment_key],
    });

    if (!page.rows[0]) {
      throw new LucidError({
        type: "basic",
        name: "Page not found",
        message: `Page with id "${id}" not found in environment "${environment_key}"!`,
        status: 404,
      });
    }

    return page.rows[0];
  };
  static #slugUnique = async (data: {
    slug: string;
    homepage: boolean;
    environment_key: string;
    collection_key: string;
    parent_id?: number;
  }) => {
    const client = await getDBClient;

    // For homepage, return "/"
    if (data.homepage) {
      return "/";
    }

    // Sanitize slug with slugify
    data.slug = slugify(data.slug, { lower: true, strict: true });

    const values: Array<any> = [
      data.slug,
      data.collection_key,
      data.environment_key,
    ];
    if (data.parent_id) values.push(data.parent_id);

    const slugCount = await client.query<{ count: number }>({
      // where slug is like, slug-example, slug-example-1, slug-example-2
      text: `SELECT COUNT(*) 
        FROM 
          lucid_pages 
        WHERE slug ~ '^${data.slug}-\\d+$' 
        OR 
          slug = $1
        AND
          collection_key = $2
        AND
          environment_key = $3
        ${data.parent_id ? `AND parent_id = $4` : `AND parent_id IS NULL`}`,
      values: values,
    });

    if (slugCount.rows[0].count >= 1) {
      return `${data.slug}-${slugCount.rows[0].count}`;
    } else {
      return data.slug;
    }
  };
  static #checkParentNotHomepage = async (data: {
    parent_id: number | null;
    environment_key: string;
  }) => {
    const client = await getDBClient;

    if (!data.parent_id) return;
    const values: Array<any> = [data.environment_key];
    if (data.parent_id) values.push(data.parent_id);

    const parent = await client.query<{ homepage: boolean }>({
      text: `SELECT homepage 
        FROM 
          lucid_pages 
        WHERE
          environment_key = $1
        AND 
          id = $2`,
      values: values,
    });
    if (parent.rows[0].homepage) {
      throw new LucidError({
        type: "basic",
        name: "Homepage Parent",
        message: "The homepage cannot be set as a parent!",
        status: 400,
      });
    }
  };
  static #isParentSameCollection = async (data: {
    parent_id: number;
    collection_key: string;
    environment_key: string;
  }) => {
    const client = await getDBClient;

    // Check if the parent is apart of the same collection
    const parent = await client.query<{ collection_key: string }>({
      text: `SELECT collection_key FROM lucid_pages WHERE id = $1 AND environment_key = $2`,
      values: [data.parent_id, data.environment_key],
    });

    if (!parent.rows[0]) {
      throw new LucidError({
        type: "basic",
        name: "Parent Not Found",
        message: "The parent page could not be found!",
        status: 404,
      });
    }

    if (parent.rows[0].collection_key !== data.collection_key) {
      throw new LucidError({
        type: "basic",
        name: "Parent Collection Mismatch",
        message:
          "The parent page must be in the same collection as the page you are creating!",
        status: 400,
      });
    }
  };
  static #resetHomepages = async (data: {
    current: number;
    environment_key: string;
  }) => {
    const client = await getDBClient;

    // reset homepage, set its parent to null and its full slug to slugified title
    const result = await client.query({
      text: `SELECT id, title FROM lucid_pages WHERE homepage = true AND id != $1 AND environment_key = $2`,
      values: [data.current, data.environment_key],
    });

    for (const row of result.rows) {
      let newSlug = slugify(row.title, { lower: true, strict: true });
      const slugExists = await client.query({
        text: `SELECT COUNT(*) FROM lucid_pages WHERE slug = $1 AND id != $2 AND environment_key = $3`,
        values: [newSlug, row.id, data.environment_key],
      });

      if (slugExists.rows[0].count > 0) {
        newSlug += `-${row.id}`;
      }

      await client.query({
        text: `UPDATE lucid_pages SET homepage = false, parent_id = null, slug = $2 WHERE id = $1`,
        values: [row.id, newSlug],
      });
    }
  };
}
