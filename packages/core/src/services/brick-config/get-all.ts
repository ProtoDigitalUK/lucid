import z from "zod";
// Models
import BrickConfig from "@db/models/BrickConfig";
// Schema
import bricksSchema from "@schemas/bricks";

interface ServiceData {
  query: z.infer<typeof bricksSchema.config.getAll.query>;
  collection_key: string;
  environment_key: string;
}

const getAll = async (data: ServiceData) => {
  const bricks = await BrickConfig.getAll(data.query, {
    collection_key: data.collection_key,
    environment_key: data.environment_key,
  });

  return bricks;
};

export default getAll;
