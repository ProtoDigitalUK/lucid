import { PoolClient } from "pg";
import z from "zod";
// Utils
import { SelectQueryBuilder } from "@utils/app/query-helpers.js";
import { LucidError } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Models
import Page from "@db/models/Page.js";
// Schema
import pagesSchema from "@schemas/pages.js";
// Services
import collectionsService from "@services/collections/index.js";
import collectionBricksService from "@services/collection-bricks/index.js";
// Format
import formatPage from "@utils/format/format-page.js";

export interface ServiceData {
  query: z.infer<typeof pagesSchema.getSingle.query>;
  environment_key: string;
  id: number;
}

const getSingle = async (client: PoolClient, data: ServiceData) => {
  const { include } = data.query;

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
      "author_id",
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

  const page = await Page.getSingle(client, SelectQuery);

  if (!page) {
    throw new LucidError({
      type: "basic",
      name: "Page not found",
      message: `Page with id "${data.id}" not found`,
      status: 404,
    });
  }

  const collection = await service(
    collectionsService.getSingle,
    false,
    client
  )({
    collection_key: page.collection_key,
    environment_key: page.environment_key,
    type: "pages",
  });

  if (include && include.includes("bricks")) {
    const pageBricks = await service(
      collectionBricksService.getAll,
      false,
      client
    )({
      reference_id: page.id,
      type: "pages",
      environment_key: data.environment_key,
      collection: collection,
    });
    page.builder_bricks = pageBricks.builder_bricks;
    page.fixed_bricks = pageBricks.fixed_bricks;
  }

  return formatPage(page, [collection]);
};

export default getSingle;
