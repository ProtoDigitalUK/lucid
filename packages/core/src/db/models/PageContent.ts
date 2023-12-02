import { PoolClient } from "pg";
// Utils
import { aliasGenerator } from "@utils/app/query-helpers.js";

// -------------------------------------------
// Page
export type PageContentT = {
  id: number;
  page_id: number;
  language_id: number;

  title: string;
  slug: string;
  excerpt: string | null;

  created_at: string;
  updated_at: string;
};

export default class PageContent {
  static getSlugCount: PageContentGetSlugCount = async (client, data) => {
    const values: Array<any> = [
      data.slug,
      data.collection_key,
      data.environment_key,
      data.language_id,
      data.page_id,
    ];
    if (data.parent_id) values.push(data.parent_id);

    const slugCount = await client.query<{ count: string }>({
      text: `
        SELECT COUNT(*) 
        FROM 
          headless_page_content
        JOIN
          headless_pages
        ON
          headless_page_content.page_id = headless_pages.id
        WHERE 
          (slug ~ ('^' || $1 || '-\\d+$') OR slug = $1)
        AND
          headless_pages.collection_key = $2
        AND
          headless_pages.environment_key = $3
        AND
          headless_page_content.language_id = $4
        AND
          headless_page_content.page_id != $5
        ${
          data.parent_id
            ? `AND headless_pages.parent_id = $6`
            : `AND headless_pages.parent_id IS NULL`
        }`,
      values: values,
    });

    return Number(slugCount.rows[0].count);
  };
  static createSingle: PageContentCreateSingle = async (client, data) => {
    const pageContent = await client.query<{
      id: PageContentT["id"];
    }>({
      text: `INSERT INTO headless_page_content (language_id, page_id, title, slug, excerpt) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      values: [
        data.language_id,
        data.page_id,
        data.title,
        data.slug,
        data.excerpt || null,
      ],
    });

    return pageContent.rows[0];
  };
  static createOrUpdateMultiple: PageContentCreateOrUpdateMultiple = async (
    client,
    data
  ) => {
    if (data.length === 0) return [];

    const aliases = aliasGenerator({
      columns: [
        {
          key: "language_id",
        },
        {
          key: "page_id",
        },
        {
          key: "title",
        },
        {
          key: "slug",
        },
        {
          key: "excerpt",
        },
      ],
      rows: data.length,
    });
    const dataValues = data.flatMap((item) => {
      return [
        item.language_id,
        item.page_id,
        item.title || null,
        item.slug || null,
        item.excerpt || null,
      ];
    });

    const contentRes = await client.query<{
      id: PageContentT["id"];
    }>(
      `INSERT INTO 
          headless_page_content (language_id, page_id, title, slug, excerpt)
        VALUES 
          ${aliases}
        ON CONFLICT (page_id, language_id)
        DO UPDATE SET
          title = EXCLUDED.title,
          slug = EXCLUDED.slug,
          excerpt = EXCLUDED.excerpt
        RETURNING id`,
      dataValues
    );

    return contentRes.rows;
  };
  static getOldHomepages: PageContentGetOldHomepages = async (client, data) => {
    const result = await client.query<{
      id: number;
      title: string;
      page_id: number;
      language_id: number;
    }>({
      text: `
        SELECT headless_page_content.id, headless_page_content.title, headless_pages.id AS page_id, headless_page_content.language_id
        FROM headless_page_content
        JOIN headless_pages
        ON headless_page_content.page_id = headless_pages.id
        WHERE headless_pages.homepage = true
        AND headless_pages.id != $1
        AND headless_pages.environment_key = $2`,
      values: [data.current_id, data.environment_key],
    });

    return result.rows;
  };
  static checkSlugExistence: PageContentCheckSlugExistence = async (
    client,
    data
  ) => {
    const slugExists = await client.query<{
      count: string;
    }>({
      text: `
        SELECT COUNT(*) 
        FROM headless_page_content
        JOIN headless_pages
        ON headless_page_content.page_id = headless_pages.id
        WHERE headless_page_content.slug = $1
        AND headless_page_content.language_id = $2
        AND headless_page_content.id != $3
        AND headless_pages.environment_key = $4`,
      values: [data.slug, data.language_id, data.id, data.environment_key],
    });
    return Number(slugExists.rows[0].count) > 0;
  };
  static updateSingleSlug: PageContentUpdateSingleSlug = async (
    client,
    data
  ) => {
    const pageContent = await client.query<{
      id: PageContentT["id"];
    }>({
      text: `UPDATE headless_page_content SET slug = $1 WHERE id = $2 RETURNING id`,
      values: [data.slug, data.id],
    });

    return pageContent.rows[0];
  };
}

// -------------------------------------------
// Types
type PageContentGetSlugCount = (
  client: PoolClient,
  data: {
    slug: string;
    environment_key: string;
    collection_key: string;
    parent_id?: number;
    language_id: number;
    page_id: number;
  }
) => Promise<number>;

type PageContentCreateSingle = (
  client: PoolClient,
  data: {
    language_id: number;
    page_id: number;
    title: string;
    slug: string;
    excerpt?: string;
  }
) => Promise<{
  id: PageContentT["id"];
}>;

type PageContentCreateOrUpdateMultiple = (
  client: PoolClient,
  data: {
    language_id: number;
    page_id: number;
    title?: string | null;
    slug?: string | null;
    excerpt?: string | null;
  }[]
) => Promise<
  {
    id: PageContentT["id"];
  }[]
>;

type PageContentGetOldHomepages = (
  client: PoolClient,
  data: {
    current_id: number;
    environment_key: string;
  }
) => Promise<
  Array<{
    id: number;
    title: string;
    page_id: number;
    language_id: number;
  }>
>;

type PageContentCheckSlugExistence = (
  client: PoolClient,
  data: {
    slug: string;
    id: number;
    language_id: number;
    environment_key: string;
  }
) => Promise<boolean>;

type PageContentUpdateSingleSlug = (
  client: PoolClient,
  data: {
    id: number;
    slug: string;
  }
) => Promise<{
  id: PageContentT["id"];
}>;
