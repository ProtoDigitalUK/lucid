import { PoolClient } from "pg";
// Utils
import { SelectQueryBuilder } from "@utils/app/query-helpers.js";
import service from "@utils/app/service.js";
// Models
import SinglePage from "@db/models/SinglePage.js";
// Services
import collectionsService from "@services/collections/index.js";
import collectionBricksService from "@services/collection-bricks/index.js";

export interface ServiceData {
  environment_key: string;
  collection_key: string;
  user_id: number;
  include_bricks?: boolean;
}

const getSingle = async (client: PoolClient, data: ServiceData) => {
  // Checks if we have access to the collection
  const collection = await service(
    collectionsService.getSingle,
    false,
    client
  )({
    collection_key: data.collection_key,
    environment_key: data.environment_key,
    type: "singlepage",
  });

  // Build Query Data and Query
  const SelectQuery = new SelectQueryBuilder({
    columns: [
      "id",
      "environment_key",
      "collection_key",

      "created_at",
      "updated_at",
      "updated_by",
    ],
    exclude: undefined,
    filter: {
      data: {
        collection_key: data.collection_key,
        environment_key: data.environment_key,
      },
      meta: {
        collection_key: {
          operator: "=",
          type: "text",
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

  let singlepage = await SinglePage.getSingle(client, SelectQuery);

  if (!singlepage) {
    singlepage = await SinglePage.createSingle(client, {
      user_id: data.user_id,
      environment_key: data.environment_key,
      collection_key: data.collection_key,
      builder_bricks: [],
      fixed_bricks: [],
    });
  }

  if (data.include_bricks) {
    const pageBricks = await service(
      collectionBricksService.getAll,
      false,
      client
    )({
      reference_id: singlepage.id,
      type: "singlepage",
      environment_key: data.environment_key,
      collection: collection,
    });
    singlepage.builder_bricks = pageBricks.builder_bricks;
    singlepage.fixed_bricks = pageBricks.fixed_bricks;
  }

  return singlepage;
};

export default getSingle;
