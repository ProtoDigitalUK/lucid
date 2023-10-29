import { PoolClient } from "pg";
import z from "zod";
// Utils
import { SelectQueryBuilder } from "@utils/app/query-helpers.js";
// Models
import Page from "@db/models/Page.js";
// Schema
import pagesSchema from "@schemas/pages.js";
// Utils
import service from "@utils/app/service.js";
// Services
import collectionsService from "@services/collections/index.js";
// Format
import formatPage from "@utils/format/format-page.js";

export interface ServiceData {
  page_id: number;
  environment_key: string;
  query: z.infer<typeof pagesSchema.getMultiple.query>;
}

const getMultipleValidParents = async (
  client: PoolClient,
  data: ServiceData
) => {
  const { filter, sort, page, per_page } = data.query;

  // Build Query Data and Query
  const SelectQuery = new SelectQueryBuilder({
    columns: [
      "id",
      "environment_key",
      "collection_key",
      "parent_id",
      "title",
      "slug",
      "homepage",
      "excerpt",
      "published",
      "published_at",
      "author_id",
      "created_by",
      "created_at",
      "updated_at",
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
        },
        title: {
          operator: "%",
          type: "text",
          columnType: "standard",
        },
        environment_key: {
          operator: "=",
          type: "text",
          columnType: "standard",
        },
        homepage: {
          operator: "=",
          type: "boolean",
          columnType: "standard",
        },
      },
    },
    values: [data.page_id],
    where: ["id NOT IN (SELECT id FROM descendants)", "id != $1"],
    sort: sort,
    page: page,
    per_page: per_page,
  });

  const response = await Promise.all([
    Page.getValidParents(client, {
      page_id: data.page_id,
      query_instance: SelectQuery,
    }),
    service(
      collectionsService.getAll,
      false,
      client
    )({
      query: {},
    }),
  ]);

  return {
    data: response[0].data.map((page) => formatPage(page, response[1])),
    count: response[0].count,
  };
};

export default getMultipleValidParents;
