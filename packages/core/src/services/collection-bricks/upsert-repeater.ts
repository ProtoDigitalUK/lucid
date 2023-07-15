import { PoolClient } from "pg";
// Utils
import service from "@utils/app/service";
// Models
import CollectionBrick, { BrickFieldObject } from "@db/models/CollectionBrick";
// Services
import collectionBricksService from "@services/collection-bricks";

export interface ServiceData {
  brick_id: number;
  data: BrickFieldObject;
}

/*
  Handles the upsert of a repeater field
*/

const upsertRepeater = async (client: PoolClient, data: ServiceData) => {
  let repeaterId;
  const brickField = data.data;

  // Check if id exists. If it does, update, else create.
  if (brickField.fields_id && brickField.group_position !== undefined) {
    const repeaterRes = await CollectionBrick.updateRepeater(client, {
      field: brickField,
    });
    repeaterId = repeaterRes.fields_id;
  } else {
    await service(
      collectionBricksService.checkFieldExists,
      false,
      client
    )({
      brick_id: data.brick_id,
      key: brickField.key,
      type: brickField.type,
      parent_repeater: brickField.parent_repeater,
      group_position: brickField.group_position,
      create: true,
    });

    const repeaterRes = await CollectionBrick.createRepeater(client, {
      brick_id: data.brick_id,
      field: brickField,
    });
    repeaterId = repeaterRes.fields_id;
  }

  // If it has no items, return
  if (!brickField.items) return;

  // For each item, create or update the repeater item and then create or update the fields for that item
  const promises = [];

  for (let i = 0; i < brickField.items.length; i++) {
    const item = brickField.items[i];
    if (item.type === "tab") continue;

    // Update item data
    item.parent_repeater = repeaterId;

    // If its a repeater, recursively call this function
    if (item.type === "repeater") {
      promises.push(
        service(
          collectionBricksService.upsertRepeater,
          false,
          client
        )({
          brick_id: data.brick_id,
          data: item,
        })
      );
      continue;
    }

    // Update the field
    promises.push(
      service(
        collectionBricksService.upsertField,
        false,
        client
      )({
        brick_id: data.brick_id,
        data: item,
      })
    );
  }

  await Promise.all(promises);
};

export default upsertRepeater;
