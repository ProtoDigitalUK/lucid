import { PoolClient } from "pg";
// Utils
import service from "@utils/app/service.js";
// Models
import SinglePage from "@db/models/SinglePage.js";
import { BrickObject } from "@db/models/CollectionBrick.js";
// Services
import environmentsService from "@services/environments/index.js";
import collectionsService from "@services/collections/index.js";
import singlePageService from "@services/single-pages/index.js";
import collectionBricksService from "@services/collection-bricks/index.js";

export interface ServiceData {
  environment_key: string;
  collection_key: string;
  user_id: number;
  bricks: Array<BrickObject>;
}

const updateSingle = async (client: PoolClient, data: ServiceData) => {
  // Used to check if we have access to the collection
  await service(
    environmentsService.getSingle,
    false,
    client
  )({
    key: data.environment_key,
  });

  await service(
    collectionsService.getSingle,
    false,
    client
  )({
    collection_key: data.collection_key,
    environment_key: data.environment_key,
    type: "singlepage",
  });

  // -------------------------------------------
  // Gets the single page, creates it if it doesn't exist
  const getSinglepage = await service(
    singlePageService.getSingle,
    false,
    client
  )({
    user_id: data.user_id,
    environment_key: data.environment_key,
    collection_key: data.collection_key,
  });

  console.log(getSinglepage, "getSinglepage");

  await service(
    collectionBricksService.updateMultiple,
    true,
    client
  )({
    id: getSinglepage.id,
    environment_key: data.environment_key,
    collection_key: data.collection_key,
    bricks: data.bricks,
    type: "singlepage",
  });

  // -------------------------------------------
  // Update Single Page
  await SinglePage.updateSingle(client, {
    id: getSinglepage.id,
    user_id: data.user_id,
  });

  return undefined;
};

export default updateSingle;
