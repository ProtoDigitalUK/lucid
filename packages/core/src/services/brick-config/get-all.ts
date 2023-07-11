import z from "zod";
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

const getAll = async (data: ServiceData) => {
  const environment = await environmentsService.getSingle({
    key: data.environment_key,
  });
  const collection = await collectionsService.getSingle({
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
