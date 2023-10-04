import { PoolClient } from "pg";
// Types
import { CollectionResT } from "@lucid/types/src/collections.js";
// Models
import CollectionBrick, { BrickObject } from "@db/models/CollectionBrickNew.js";
// Checks
import checkDuplicateOrders from "@services/collection-bricks/new/checks/check-duplicate-orders.js";

export interface ServiceData {
  id: number;
  type: CollectionResT["type"];
  bricks: Array<BrickObject>;
  collection_key: string;
  environment_key: string;
}

const updateMultiple = async (client: PoolClient, data: ServiceData) => {
  // ---------------------------------------------------------------------------------------------------------------------------------
  // Validation & Checks
  checkDuplicateOrders(data.bricks);

  // ---------------------------------------------------------------------------------------------------------------------------------
  // Clear Old Data

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

  // ---------------------------------------------------------------------------------------------------------------------------------
  // Update/Create Data

  // Create all new bricks
  const newBricks = await CollectionBrick.createMultipleBricks(client, {
    type: data.type,
    reference_id: data.id,
    bricks: data.bricks.filter((brick) => brick.id === undefined) || [],
  });

  // Get the bricks that need to be updated
  const updateIds = data.bricks.filter((brick) => brick.id !== undefined) || [];

  // Update new bricks with their new ids
  data.bricks = data.bricks.map((brick) => {
    const newBrick = newBricks.find(
      (b) => b.brick_key === brick.key && b.brick_order === brick.order
    );
    if (newBrick) {
      brick.id = newBrick.id;
    }
    return brick;
  });

  // Update all bricks that already exist, along with all fields
  const updateData = await Promise.all([
    CollectionBrick.updateMultipleBrickOrders(
      client,
      updateIds as {
        id: number;
        order: number;
      }[]
    ),
    // TODO: Update fields
  ]);

  return [];
};

export default updateMultiple;
