import { PoolClient } from "pg";
// Utils
import service from "@utils/app/service.js";
// Models
import { BrickObject } from "@db/models/CollectionBrick.js";
// Services
import collectionBricksService from "@services/collection-bricks/index.js";
// Types
import { CollectionResT } from "@lucid/types/src/collections.js";
import { EnvironmentResT } from "@lucid/types/src/environments.js";

export interface ServiceData {
  id: number;
  builder_bricks: Array<BrickObject>;
  fixed_bricks: Array<BrickObject>;
  collection: CollectionResT;
  environment: EnvironmentResT;
}

/*
  Updates multiple bricks for a collection. 
  
  This will create/update/delete bricks based on the data provided.
*/

const updateMultiple = async (client: PoolClient, data: ServiceData) => {
  // -------------------------------------------
  // Update/Create Bricks
  const builderBricksPromise =
    data.builder_bricks.map((brick, index) =>
      service(
        collectionBricksService.upsertSingle,
        false,
        client
      )({
        reference_id: data.id,
        brick: brick,
        brick_type: "builder",
        order: index,
        environment: data.environment,
        collection: data.collection,
      })
    ) || [];
  const fixedBricksPromise =
    data.fixed_bricks.map((brick, index) =>
      service(
        collectionBricksService.upsertSingle,
        false,
        client
      )({
        reference_id: data.id,
        brick: brick,
        brick_type: "fixed",
        order: index,
        environment: data.environment,
        collection: data.collection,
      })
    ) || [];

  const [buildBrickRes, fixedBrickRes] = await Promise.all([
    Promise.all(builderBricksPromise),
    Promise.all(fixedBricksPromise),
  ]);

  const builderIds = buildBrickRes.map((brickId) => brickId);
  const fixedIds = fixedBrickRes.map((brickId) => brickId);

  // -------------------------------------------
  // Delete unused bricks
  if (builderIds.length > 0)
    await service(
      collectionBricksService.deleteUnused,
      false,
      client
    )({
      type: data.collection.type,
      reference_id: data.id,
      brick_ids: builderIds,
      brick_type: "builder",
    });
  if (fixedIds.length > 0)
    await service(
      collectionBricksService.deleteUnused,
      false,
      client
    )({
      type: data.collection.type,
      reference_id: data.id,
      brick_ids: fixedIds,
      brick_type: "fixed",
    });
};

export default updateMultiple;
