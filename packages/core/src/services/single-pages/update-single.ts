import { PoolClient } from "pg";
import z from "zod";
// Utils
import service from "@utils/app/service";
// Models
import SinglePage from "@db/models/SinglePage";
// Schema
import { BrickSchema } from "@schemas/bricks";
// Services
import environmentsService from "@services/environments";
import collectionsService from "@services/collections";
import collectionBricksService from "@services/collection-bricks";
import singlePageService from "@services/single-pages";

export interface ServiceData {
  environment_key: string;
  collection_key: string;
  user_id: number;
  builder_bricks?: z.infer<typeof BrickSchema>[];
  fixed_bricks?: z.infer<typeof BrickSchema>[];
}

const updateSingle = async (client: PoolClient, data: ServiceData) => {
  // Used to check if we have access to the collection
  const environment = await service(
    environmentsService.getSingle,
    false,
    client
  )({
    key: data.environment_key,
  });

  const collection = await service(
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

  // -------------------------------------------
  // validate bricks
  await service(
    collectionBricksService.validateBricks,
    false,
    client
  )({
    builder_bricks: data.builder_bricks || [],
    fixed_bricks: data.fixed_bricks || [],
    collection: collection,
    environment: environment,
  });

  // -------------------------------------------
  // Update Single Page
  const singlepage = await SinglePage.updateSingle(client, {
    id: getSinglepage.id,
    user_id: data.user_id,
  });

  // -------------------------------------------
  // Update/Create Bricks
  await service(
    collectionBricksService.updateMultiple,
    false,
    client
  )({
    id: singlepage.id,
    builder_bricks: data.builder_bricks || [],
    fixed_bricks: data.fixed_bricks || [],
    collection: collection,
    environment: environment,
  });

  return await service(
    singlePageService.getSingle,
    false,
    client
  )({
    user_id: data.user_id,
    environment_key: data.environment_key,
    collection_key: data.collection_key,
    include_bricks: true,
  });
};

export default updateSingle;
