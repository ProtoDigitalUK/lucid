import { PoolClient } from "pg";
// Types
import { CollectionResT } from "@lucid/types/src/collections.js";
// Models
import CollectionBrick, { BrickObject } from "@db/models/CollectionBrick.js";
// Utils
import formatUpsertFields from "@utils/bricks/format-upsert-fields.js";
import service from "@utils/app/service.js";
// Checks
import checkValidateBricks from "@services/collection-bricks/checks/check-validate-bricks.js";
import checkDuplicateOrders from "@services/collection-bricks/checks/check-duplicate-orders.js";
// Services
import collectionBricks from "@services/collection-bricks/index.js";

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

  const bricksToUpdate = data.bricks.filter(
    (brick) => brick.id !== undefined && brick.id !== null
  );
  const bricksToCreate = data.bricks.filter(
    (brick) => brick.id === undefined || brick.id === null
  );

  const deleteFieldIds = getFieldsToDeleteForLanguage(
    existingBricks,
    bricksToUpdate
  );
  const deleteGroupIds = getGroupsToDeleteForLanguage(
    existingBricks,
    bricksToUpdate
  );

  const [_, __, newBricks] = await Promise.all([
    CollectionBrick.deleteMultipleBrickFields(client, {
      ids: deleteFieldIds,
    }),
    CollectionBrick.deleteMultipleGroups(client, {
      ids: deleteGroupIds,
    }),
    CollectionBrick.createMultipleBricks(client, {
      type: data.type,
      reference_id: data.id,
      bricks: bricksToCreate,
    }),
  ]);

  assignBrickIds(data.bricks, newBricks);

  const newGroups = await service(
    collectionBricks.createMultipleGroups,
    false,
    client
  )({
    bricks: data.bricks,
  });

  assignFieldIds(data.bricks, newGroups); // add back new groups to assignFieldIds so id ref- can be updated with the group id
  assignGroupsParentIds(data.bricks, newGroups); // adds parent_group_id to og groups based on new group ids

  const groups = data.bricks.map((brick) => brick.groups || []).flat();
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
    CollectionBrick.updateMultipleGroups(client, {
      groups: groups.filter((group) => typeof group.group_id === "number"),
    }),
  ]);

  return undefined;
};

function getFieldsToDeleteForLanguage(
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

function getGroupsToDeleteForLanguage(
  existingBricks: Array<{
    id: number;
    groups: {
      group_id: number;
    }[];
  }>,
  bricksToUpdate: Array<BrickObject>
) {
  const groups = bricksToUpdate.map((brick) => brick.groups || []).flat();
  const existingGroups = existingBricks
    .map((brick) => brick.groups || [])
    .flat();

  const deleteGroupIds: Array<number> = [];
  existingGroups.forEach((group) => {
    if (
      !groups.some(
        (g) => g.group_id !== undefined && g.group_id === group.group_id
      )
    ) {
      deleteGroupIds.push(group.group_id);
    }
  });

  return deleteGroupIds;
}

function assignBrickIds(
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

function assignFieldIds(
  bricks: Array<BrickObject>,
  groups: Array<{
    group_id: number;
    ref: string;
  }>
) {
  const newGroupMap: { [key: string]: number } = {};
  groups.forEach((group) => {
    newGroupMap[group.ref] = group.group_id;
  });
  bricks.forEach((brick) => {
    brick.fields?.forEach((field) => {
      if (field.group_id === undefined) return;

      if (newGroupMap[field.group_id]) {
        field.group_id = newGroupMap[field.group_id];
      }
    });
  });
}

function assignGroupsParentIds(
  bricks: Array<BrickObject>,
  groups: Array<{
    group_id: number;
    ref: string;
  }>
) {
  const newGroupMap: { [key: string]: number } = {};
  groups.forEach((group) => {
    newGroupMap[group.ref] = group.group_id;
  });

  bricks.forEach((brick) => {
    brick.groups?.forEach((group) => {
      if (!group.parent_group_id) return;

      if (newGroupMap[group.parent_group_id]) {
        group.parent_group_id = newGroupMap[group.parent_group_id];
      }
    });
  });
}

export default updateMultiple;
