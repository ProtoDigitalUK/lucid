import { PoolClient } from "pg";
import z from "zod";
// Utils
import service from "@utils/app/service.js";
import { SelectQueryBuilder } from "@utils/app/query-helpers.js";
// Models
import Page from "@db/models/Page.js";
// Schema
import pagesSchema from "@schemas/pages.js";
// Services
import languagesService from "@services/languages/index.js";
// Format
import formatPage from "@utils/format/format-page.js";

export interface ServiceData {
  query: z.infer<typeof pagesSchema.getMultiple.query>;
  environment_key: string;
  language: {
    id: number;
  };
}

const getMultiple = async (client: PoolClient, data: ServiceData) => {
  const { filter, sort, page, per_page } = data.query;

  const defaultLanguage = await service(
    languagesService.getDefault,
    false,
    client
  )();

  // Build Query Data and Query
  const SelectQuery = new SelectQueryBuilder({
    columns: [
      "lucid_pages.id",
      "environment_key",
      "collection_key",
      "parent_id",
      "homepage",
      "published",
      "published_at",
      "author_id",
      "created_by",
      "lucid_pages.created_at",
      "lucid_pages.updated_at",
      "lucid_page_content.title",
      "lucid_page_content.slug",
      "lucid_page_content.excerpt",
      "lucid_page_content.language_id",
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
          table: "lucid_page_content",
        },
        slug: {
          operator: "%",
          type: "text",
          columnType: "standard",
          table: "lucid_page_content",
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
    sort: {
      data: sort,
    },
    page: page,
    per_page: per_page,
    values: [data.language.id, defaultLanguage.id],
  });

  const pages = await Page.getMultiple(client, SelectQuery);

  return {
    data: pages.data.map((page) => formatPage(page, true)),
    count: pages.count,
  };
};

export default getMultiple;
