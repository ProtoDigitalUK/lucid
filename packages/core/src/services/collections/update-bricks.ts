// Models
import { BrickObject } from "@db/models/CollectionBrick";
import CollectionBrick from "@db/models/CollectionBrick";
// Services
import { CollectionT } from "@services/collections";
import { EnvironmentResT } from "@services/environments";

export interface ServiceData {
  id: number;
  builder_bricks: Array<BrickObject>;
  fixed_bricks: Array<BrickObject>;
  collection: CollectionT;
  environment: EnvironmentResT;
}

const updateBricks = async (data: ServiceData) => {
  // -------------------------------------------
  // Update/Create Bricks
  const builderBricksPromise =
    data.builder_bricks.map((brick, index) =>
      CollectionBrick.createOrUpdate({
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
      CollectionBrick.createOrUpdate({
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
    await CollectionBrick.deleteUnused({
      type: data.collection.type,
      reference_id: data.id,
      brick_ids: builderIds,
      brick_type: "builder",
    });
  if (fixedIds.length > 0)
    await CollectionBrick.deleteUnused({
      type: data.collection.type,
      reference_id: data.id,
      brick_ids: fixedIds,
      brick_type: "fixed",
    });
};

export default updateBricks;
