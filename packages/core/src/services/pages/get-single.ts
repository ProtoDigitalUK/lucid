import z from "zod";
// Utils
import { SelectQueryBuilder } from "@utils/app/query-helpers";
import { LucidError } from "@utils/app/error-handler";
// Models
import Page from "@db/models/Page";
// Schema
import pagesSchema from "@schemas/pages";
// Services
import collectionsService from "@services/collections";
import collectionBricksService from "@services/collection-bricks";
// Format
import formatPage from "@utils/format/format-page";

export interface ServiceData {
  query: z.infer<typeof pagesSchema.getSingle.query>;
  environment_key: string;
  id: number;
}

const getSingle = async (data: ServiceData) => {
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

  const page = await Page.getSingle(SelectQuery);

  if (!page) {
    throw new LucidError({
      type: "basic",
      name: "Page not found",
      message: `Page with id "${data.id}" not found`,
      status: 404,
    });
  }

  if (include && include.includes("bricks")) {
    const collection = await collectionsService.getSingle({
      collection_key: page.collection_key,
      environment_key: page.environment_key,
      type: "pages",
    });

    const pageBricks = await collectionBricksService.getAll({
      reference_id: page.id,
      type: "pages",
      environment_key: data.environment_key,
      collection: collection,
    });
    page.builder_bricks = pageBricks.builder_bricks;
    page.fixed_bricks = pageBricks.fixed_bricks;
  }

  return formatPage(page);
};

export default getSingle;
