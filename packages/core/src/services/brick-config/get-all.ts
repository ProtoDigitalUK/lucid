import { PoolClient } from "pg";
import z from "zod";
//  Utils
import service from "@utils/app/service.js";
// Schema
import bricksSchema from "@schemas/bricks.js";
// Services
import brickConfigService from "@services/brick-config/index.js";
import collectionsService from "@services/collections/index.js";
import environmentsService from "@services/environments/index.js";
// Types
import { BrickConfigT } from "@lucid/types/src/bricks.js";

export interface ServiceData {
  query: z.infer<typeof bricksSchema.config.getAll.query>;
}

const getAll = async (client: PoolClient, data: ServiceData) => {
  const environment_key = data.query.filter?.environment_key;
  const collection_key = data.query.filter?.collection_key;

  let bricks: BrickConfigT[] = [];

  if (collection_key && environment_key) {
    const environment = await service(
      environmentsService.getSingle,
      false,
      client
    )({
      key: environment_key,
    });
    const collection = await service(
      collectionsService.getSingle,
      false,
      client
    )({
      collection_key: collection_key,
      environment_key: environment_key,
      environment: environment,
    });

    const allowedBricks = brickConfigService.getAllAllowedBricks({
      collection: collection,
      environment: environment,
    });
    bricks = allowedBricks.bricks;
  } else {
    const builderInstances = brickConfigService.getBrickConfig();
    for (const instance of builderInstances) {
      const brick = brickConfigService.getBrickData(instance, {
        include: ["fields"],
      });
      bricks.push(brick);
    }
  }

  if (!data.query.include?.includes("fields")) {
    bricks.forEach((brick) => {
      delete brick.fields;
    });
  }

  return bricks;
};

export default getAll;
