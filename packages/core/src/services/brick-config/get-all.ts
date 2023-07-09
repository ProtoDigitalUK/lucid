import z from "zod";
// Models
import Environment from "@db/models/Environment";
import Collection from "@db/models/Collection";
// Schema
import bricksSchema from "@schemas/bricks";
// Services
import brickConfig from "@services/brick-config";

export interface ServiceData {
  query: z.infer<typeof bricksSchema.config.getAll.query>;
  collection_key: string;
  environment_key: string;
}

const getAll = async (data: ServiceData) => {
  const environment = await Environment.getSingle(data.environment_key);
  const collection = await Collection.getSingle({
    collection_key: data.collection_key,
    environment_key: data.environment_key,
    environment: environment,
  });

  const allowedBricks = brickConfig.getAllAllowedBricks({
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
