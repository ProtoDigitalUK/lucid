import { PoolClient } from "pg";
// Types
import { CollectionResT } from "@lucid/types/src/collections.js";
// Models
import CollectionBrick, { BrickObject } from "@db/models/CollectionBrickNew.js";
// Utils
import formatUpsertFields from "@utils/bricks/format-upsert-fields.js";
import service from "@utils/app/service.js";
// Checks
import checkValidateBricks from "@services/collection-bricks/checks/check-validate-bricks.js";
import checkDuplicateOrders from "@services/collection-bricks/checks/check-duplicate-orders.js";

export interface ServiceData {
  id: number;
  type: CollectionResT["type"];
  bricks: Array<BrickObject>;
  collection_key: string;
  environment_key: string;
}

const updateMultiple = async (client: PoolClient, data: ServiceData) => {
  checkDuplicateOrders(data.bricks);
  await service(checkValidateBricks, false, client)(data);

  const existingBricks = await CollectionBrick.getAllBricks(client, {
    type: data.type,
    reference_id: data.id,
  });

  const bricksToUpdate = data.bricks.filter((brick) => brick.id !== undefined);
  const bricksToCreate = data.bricks.filter((brick) => brick.id === undefined);

  const deleteFieldIds = getFieldsToDelete(existingBricks, bricksToUpdate);

  const [_, newBricks] = await Promise.all([
    CollectionBrick.deleteMultipleBrickFields(client, {
      ids: deleteFieldIds,
    }),
    CollectionBrick.createMultipleBricks(client, {
      type: data.type,
      reference_id: data.id,
      bricks: bricksToCreate,
    }),
  ]);

  assignIdsToNewBricks(data.bricks, newBricks);

  const fields = data.bricks.map(formatUpsertFields).flat();

  await Promise.all([
    CollectionBrick.updateMultipleBrickOrders(
      client,
      bricksToUpdate as Array<{
        id: number;
        order: number;
      }>
    ),
    CollectionBrick.updateMultipleBrickFields(client, {
      fields: fields.filter((field) => field.fields_id !== undefined),
    }),
    CollectionBrick.createMultipleBrickFields(client, {
      fields: fields.filter((field) => field.fields_id === undefined),
    }),
    CollectionBrick.deleteMultipleBricks(client, {
      ids: existingBricks
        .filter((brick) => !bricksToUpdate.some((b) => b.id === brick.id))
        .map((brick) => brick.id),
    }),
  ]);

  return undefined;
};

function getFieldsToDelete(
  existingBricks: Array<{
    id: number;
    fields: {
      id: number;
    }[];
  }>,
  bricksToUpdate: Array<BrickObject>
) {
  const deleteFieldIds: Array<number> = [];
  const updateIdsSet = new Set(bricksToUpdate.map((b) => b.id));

  existingBricks.forEach((brick) => {
    if (updateIdsSet.has(brick.id)) {
      const currentBrickFields = brick.fields || [];
      currentBrickFields.forEach((field) => {
        if (
          !bricksToUpdate.some(
            (b) => b.fields && b.fields.some((f) => f.fields_id === field.id)
          )
        ) {
          deleteFieldIds.push(field.id);
        }
      });
    }
  });

  return deleteFieldIds;
}

function assignIdsToNewBricks(
  bricks: Array<BrickObject>,
  newBricks: Array<{
    id: number;
    brick_order: number;
    brick_key: string;
  }>
) {
  bricks.forEach((brick) => {
    const matchingNewBrick = newBricks.find(
      (b) => b.brick_key === brick.key && b.brick_order === brick.order
    );
    if (matchingNewBrick) {
      brick.id = matchingNewBrick.id;
    }
  });
}

export default updateMultiple;
