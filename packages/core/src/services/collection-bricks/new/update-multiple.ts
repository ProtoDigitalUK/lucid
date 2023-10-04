import { PoolClient } from "pg";
// Types
import { CollectionResT } from "@lucid/types/src/collections.js";
// Models
import CollectionBrick, { BrickObject } from "@db/models/CollectionBrickNew.js";

export interface ServiceData {
  id: number;
  type: CollectionResT["type"];
  bricks: Array<BrickObject>;
  collection_key: string;
  environment_key: string;
}

const updateMultiple = async (client: PoolClient, data: ServiceData) => {
  // Validate the data (leave this for now)

  // -------------------------------------------
  // Bricks

  // Get all the bricks for this collection and work out which ones need to be deleted.
  const existingBricks = await CollectionBrick.getAllBricks(client, {
    type: data.type,
    reference_id: data.id,
  });

  // Delete any bricks that are not in the new list
  await CollectionBrick.deleteMultipleBricks(client, {
    ids: existingBricks
      .filter((brick) => {
        return !data.bricks.some((b) => b.id === brick.id);
      })
      .map((brick) => brick.id),
  });

  // Upsert all the bricks
  const updatedBricks = await Promise.all(
    data.bricks.map((brick) => {
      if (brick.id === undefined) {
        return CollectionBrick.createSingleBrick(client, {
          type: data.type,
          reference_id: data.id,
          brick: brick,
        });
      } else {
        return CollectionBrick.updateSingleBrick(client, {
          brick: brick,
        });
      }
    }) || []
  );

  // -------------------------------------------
  // Fields

  return [];
};

export default updateMultiple;
