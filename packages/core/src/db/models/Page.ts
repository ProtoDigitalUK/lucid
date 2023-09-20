import { PoolClient } from "pg";
// Models
import { BrickObject } from "@db/models/CollectionBrick.js";
// Utils
import {
  queryDataFormat,
  SelectQueryBuilder,
} from "@utils/app/query-helpers.js";
// Format
import { BrickResT } from "@utils/format/format-bricks.js";

// -------------------------------------------
// Types
type PageGetMultiple = (
  client: PoolClient,
  query_instance: SelectQueryBuilder
) => Promise<{
  data: PageT[];
  count: number;
}>;

type PageGetSingle = (
  client: PoolClient,
  query_instance: SelectQueryBuilder
) => Promise<PageT>;

type PageGetSingleBasic = (
  client: PoolClient,
  data: {
    id: number;
    environment_key: string;
  }
) => Promise<PageT>;

type PageGetSlugCount = (
  client: PoolClient,
  data: {
    slug: string;
    environment_key: string;
    collection_key: string;
    parent_id?: number;
  }
) => Promise<number>;

type PageCreateSingle = (
  client: PoolClient,
  data: {
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
  }
) => Promise<{
  id: PageT["id"];
}>;

type PageUpdateSingle = (
  client: PoolClient,
  data: {
    id: number;
    environment_key: string;

    title?: string;
    slug?: string;
    homepage?: boolean;
    parent_id?: number | null;
    category_ids?: Array<number>;
    published?: boolean;
    author_id?: number | null;
    excerpt?: string;
    builder_bricks?: Array<BrickObject>;
    fixed_bricks?: Array<BrickObject>;
  }
) => Promise<{
  id: PageT["id"];
}>;

type PageDeleteSingle = (
  client: PoolClient,
  data: { id: number }
) => Promise<{
  id: PageT["id"];
}>;

type PageDeleteMultiple = (
  client: PoolClient,
  data: { ids: Array<number> }
) => Promise<
  {
    id: PageT["id"];
  }[]
>;

type PageGetMultipleByIds = (
  client: PoolClient,
  data: {
    ids: Array<number>;
    environment_key: string;
  }
) => Promise<
  {
    id: PageT["id"];
  }[]
>;

type PageGetNonCurrentHomepages = (
  client: PoolClient,
  data: {
    current_id: number;
    environment_key: string;
  }
) => Promise<PageT[]>;

type PageCheckSlugExistence = (
  client: PoolClient,
  data: {
    slug: string;
    id: number;
    environment_key: string;
  }
) => Promise<boolean>;

type PageUpdatePageToNonHomepage = (
  client: PoolClient,
  data: {
    id: number;
    slug: string;
  }
) => Promise<PageT>;

type PageCheckParentAncestry = (
  client: PoolClient,
  data: {
    page_id: number;
    parent_id: number;
  }
) => Promise<
  {
    id: PageT["id"];
  }[]
>;

type PageGetValidParents = (
  client: PoolClient,
  data: {
    page_id: number;
    query_instance: SelectQueryBuilder;
  }
) => Promise<{
  data: PageT[];
  count: number;
}>;

// -------------------------------------------
// Page
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

  builder_bricks?: Array<BrickResT> | null;
  fixed_bricks?: Array<BrickResT> | null;

  published: boolean;
  published_at: string | null;
  author_id: number | null;

  created_by: number | null;
  created_at: string;
  updated_at: string;
};

export default class Page {
  static getMultiple: PageGetMultiple = async (client, query_instance) => {
    const pages = client.query<PageT>({
      text: `SELECT
          ${query_instance.query.select},
          COALESCE(json_agg(lucid_page_categories.category_id), '[]') AS categories
        FROM
          lucid_pages
        LEFT JOIN
          lucid_page_categories ON lucid_page_categories.page_id = lucid_pages.id
        ${query_instance.query.where}
        GROUP BY lucid_pages.id
        ${query_instance.query.order}
        ${query_instance.query.pagination}`,
      values: query_instance.values,
    });

    const count = client.query<{ count: string }>({
      text: `SELECT 
          COUNT(DISTINCT lucid_pages.id)
        FROM
          lucid_pages
        LEFT JOIN 
          lucid_page_categories ON lucid_page_categories.page_id = lucid_pages.id
        ${query_instance.query.where}
        `,
      values: query_instance.countValues,
    });

    const data = await Promise.all([pages, count]);

    return {
      data: data[0].rows,
      count: Number(data[1].rows[0].count),
    };
  };
  static getSingle: PageGetSingle = async (client, query_instance) => {
    const page = await client.query<PageT>({
      text: `SELECT
        ${query_instance.query.select},
        COALESCE(json_agg(lucid_page_categories.category_id), '[]') AS categories
        FROM
          lucid_pages
        LEFT JOIN
          lucid_page_categories ON lucid_page_categories.page_id = lucid_pages.id
        ${query_instance.query.where}
        GROUP BY lucid_pages.id`,
      values: query_instance.values,
    });

    return page.rows[0];
  };
  static createSingle: PageCreateSingle = async (client, data) => {
    const page = await client.query<{
      id: PageT["id"];
    }>({
      text: `INSERT INTO lucid_pages (environment_key, title, slug, homepage, collection_key, excerpt, published, parent_id, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      values: [
        data.environment_key,
        data.title,
        data.slug,
        data.homepage || false,
        data.collection_key,
        data.excerpt || null,
        data.published || false,
        data.parent_id,
        data.userId,
      ],
    });

    return page.rows[0];
  };
  static updateSingle: PageUpdateSingle = async (client, data) => {
    const { columns, aliases, values } = queryDataFormat({
      columns: [
        "title",
        "slug",
        "excerpt",
        "published",
        "published_at",
        "author_id",
        "parent_id",
        "homepage",
      ],
      values: [
        data.title,
        data.slug,
        data.excerpt,
        data.published,
        data.published ? new Date() : null,
        data.author_id,
        data.parent_id,
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
    const page = await client.query<{
      id: PageT["id"];
    }>({
      text: `UPDATE lucid_pages SET ${columns.formatted.update} WHERE id = $${
        aliases.value.length + 1
      } RETURNING id`,
      values: [...values.value, data.id],
    });

    return page.rows[0];
  };
  static deleteSingle: PageDeleteSingle = async (client, data) => {
    const page = await client.query<{
      id: PageT["id"];
    }>({
      text: `DELETE FROM lucid_pages WHERE id = $1 RETURNING id`,
      values: [data.id],
    });

    return page.rows[0];
  };
  static deleteMultiple: PageDeleteMultiple = async (client, data) => {
    const pages = await client.query<{
      id: PageT["id"];
    }>({
      text: `DELETE FROM lucid_pages WHERE id = ANY($1) RETURNING id`,
      values: [data.ids],
    });

    return pages.rows;
  };
  static getMultipleByIds: PageGetMultipleByIds = async (client, data) => {
    const pages = await client.query<{
      id: PageT["id"];
    }>({
      text: `SELECT id FROM lucid_pages WHERE id = ANY($1) AND environment_key = $2`,
      values: [data.ids, data.environment_key],
    });

    return pages.rows;
  };
  static getSingleBasic: PageGetSingleBasic = async (client, data) => {
    const page = await client.query<PageT>({
      text: `SELECT
          *
        FROM
          lucid_pages
        WHERE
          id = $1
        AND
          environment_key = $2`,
      values: [data.id, data.environment_key],
    });

    return page.rows[0];
  };
  static getSlugCount: PageGetSlugCount = async (client, data) => {
    const values: Array<any> = [
      data.slug,
      data.collection_key,
      data.environment_key,
    ];
    if (data.parent_id) values.push(data.parent_id);

    const slugCount = await client.query<{ count: string }>({
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

    return Number(slugCount.rows[0].count);
  };
  static getNonCurrentHomepages: PageGetNonCurrentHomepages = async (
    client,
    data
  ) => {
    const result = await client.query({
      text: `SELECT id, title FROM lucid_pages WHERE homepage = true AND id != $1 AND environment_key = $2`,
      values: [data.current_id, data.environment_key],
    });
    return result.rows;
  };
  static checkSlugExistence: PageCheckSlugExistence = async (client, data) => {
    const slugExists = await client.query<{
      count: string;
    }>({
      text: `SELECT COUNT(*) FROM lucid_pages WHERE slug = $1 AND id != $2 AND environment_key = $3`,
      values: [data.slug, data.id, data.environment_key],
    });
    return Number(slugExists.rows[0].count) > 0;
  };
  static updatePageToNonHomepage: PageUpdatePageToNonHomepage = async (
    client,
    data
  ) => {
    const updateRes = await client.query({
      text: `UPDATE lucid_pages SET homepage = false, parent_id = null, slug = $2 WHERE id = $1`,
      values: [data.id, data.slug],
    });

    return updateRes.rows[0];
  };
  static checkParentAncestry: PageCheckParentAncestry = async (
    client,
    data
  ) => {
    const page = await client.query<{
      id: PageT["id"];
    }>({
      text: `WITH RECURSIVE ancestry AS (
          SELECT id, parent_id
          FROM lucid_pages
          WHERE id = $1
    
          UNION ALL
    
          SELECT p.id, p.parent_id
          FROM lucid_pages p
          JOIN ancestry a ON p.id = a.parent_id
        )
        SELECT id
        FROM ancestry
        WHERE id = $2`,
      values: [data.parent_id, data.page_id],
    });

    return page.rows;
  };
  static getValidParents: PageGetValidParents = async (client, data) => {
    const pages = client.query<PageT>({
      text: `WITH RECURSIVE descendants AS (
            SELECT id, parent_id 
            FROM lucid_pages 
            WHERE parent_id = $1

            UNION ALL

            SELECT lp.id, lp.parent_id 
            FROM lucid_pages lp
            JOIN descendants d ON lp.parent_id = d.id
        )
        
        SELECT
          ${data.query_instance.query.select}
        FROM 
          lucid_pages 
        ${data.query_instance.query.where}
        ${data.query_instance.query.order}
        ${data.query_instance.query.pagination}`,
      values: data.query_instance.values,
    });

    const count = client.query<{ count: string }>({
      text: `WITH RECURSIVE descendants AS (
            SELECT id, parent_id 
            FROM lucid_pages 
            WHERE parent_id = $1

            UNION ALL

            SELECT lp.id, lp.parent_id 
            FROM lucid_pages lp
            JOIN descendants d ON lp.parent_id = d.id
        )
 
        SELECT 
          COUNT(*) 
        FROM 
          lucid_pages
        ${data.query_instance.query.where}`,
      values: data.query_instance.countValues,
    });

    const resData = await Promise.all([pages, count]);

    return {
      data: resData[0].rows,
      count: Number(resData[1].rows[0].count),
    };
  };
}
