import { PoolClient } from "pg";
import z from "zod";
// Utils
import { SelectQueryBuilder } from "@utils/app/query-helpers.js";
import service from "@utils/app/service.js";
// Models
import Page from "@db/models/Page.js";
// Schema
import pagesSchema from "@schemas/pages.js";
// Serivces
import languagesService from "@services/languages/index.js";
// Format
import formatPage from "@utils/format/format-page.js";

export interface ServiceData {
  page_id: number;
  environment_key: string;
  query: z.infer<typeof pagesSchema.getMultiple.query>;
  language: {
    id: number;
  };
}

const getMultipleValidParents = async (
  client: PoolClient,
  data: ServiceData
) => {
  const { filter, sort, page, per_page } = data.query;

  const defaultLanguage = await service(
    languagesService.getDefault,
    false,
    client
  )();

  const SelectQuery = new SelectQueryBuilder({
    columns: [
      "headless_pages.id",
      "headless_pages.environment_key",
      "headless_pages.collection_key",
      "headless_pages.parent_id",
      "headless_pages.homepage",
      "headless_pages.published",
      "headless_pages.published_at",
      "headless_pages.author_id",
      "headless_pages.created_by",
      "headless_pages.created_at",
      "headless_pages.updated_at",
      "headless_page_content.title",
      "headless_page_content.slug",
      "headless_page_content.excerpt",
      "headless_page_content.language_id",
    ],
    exclude: undefined,
    filter: {
      data: {
        ...filter,
        environment_key: data.environment_key,
        homepage: "false",
      },
      meta: {
        collection_key: {
          operator: "=",
          type: "text",
          columnType: "standard",
          table: "headless_pages",
        },
        title: {
          operator: "%",
          type: "text",
          columnType: "standard",
          table: "headless_page_content",
        },
        environment_key: {
          operator: "=",
          type: "text",
          columnType: "standard",
          table: "headless_pages",
        },
        homepage: {
          operator: "=",
          type: "boolean",
          columnType: "standard",
          table: "headless_pages",
        },
      },
    },
    values: [data.page_id, data.language.id, defaultLanguage.id],
    where: [
      "headless_pages.id NOT IN (SELECT d.id FROM descendants d)",
      "headless_pages.id != $1",
    ],
    sort: {
      data: sort,
    },
    page: page,
    per_page: per_page,
  });

  const pages = await Page.getValidParents(client, {
    page_id: data.page_id,
    query_instance: SelectQuery,
  });

  return {
    data: pages.data.map((page) => formatPage(page, true)),
    count: pages.count,
  };
};

export default getMultipleValidParents;
