import { PoolClient } from "pg";
import z from "zod";
//  Utils
import service from "@utils/app/service";
// Schema
import bricksSchema from "@schemas/bricks";
// Services
import brickConfigService from "@services/brick-config";
import collectionsService from "@services/collections";
import environmentsService from "@services/environments";

export interface ServiceData {
  query: z.infer<typeof bricksSchema.config.getAll.query>;
  collection_key: string;
  environment_key: string;
}

const getAll = async (client: PoolClient, data: ServiceData) => {
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
    environment: environment,
  });

  const allowedBricks = brickConfigService.getAllAllowedBricks({
    collection: collection,
    environment: environment,
  });

  if (!data.query.include?.includes("fields")) {
    allowedBricks.bricks.forEach((brick) => {
      delete brick.fields;
    });
  }

  return allowedBricks.bricks;
};

export default getAll;
