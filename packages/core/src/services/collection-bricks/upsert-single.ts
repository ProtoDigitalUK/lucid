// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import CollectionBrick, { BrickObject } from "@db/models/CollectionBrick";
import { EnvironmentT } from "@db/models/Environment";
// Internal packages
import { CollectionBrickConfigT } from "@lucid/collection-builder";
// Format
import { CollectionResT } from "@utils/format/format-collections";
// Services
import brickConfigService from "@services/brick-config";
import collectionBricksService from "@services/collection-bricks";

export interface ServiceData {
  reference_id: number;
  brick: BrickObject;
  brick_type: CollectionBrickConfigT["type"];
  order: number;
  environment: EnvironmentT;
  collection: CollectionResT;
}

/*
  Updates/Creates a single brick and all of its fields
*/

const upsertSingleWithFields = async (data: ServiceData) => {
  // Create or update the page brick record
  const promises = [];

  const allowed = brickConfigService.isBrickAllowed({
    key: data.brick.key,
    type: data.brick_type,
    environment: data.environment,
    collection: data.collection,
  });

  if (!allowed.allowed) {
    throw new LucidError({
      type: "basic",
      name: "Brick not allowed",
      message: `The brick "${data.brick.key}" of type "${data.brick_type}" is not allowed in this collection. Check your assigned bricks in the collection and environment.`,
      status: 500,
    });
  }

  // Create the page brick record
  let brickId = data.brick.id;

  if (brickId) {
    const brickRes = await CollectionBrick.updateSingleBrick({
      order: data.order,
      brick: data.brick,
      brick_type: data.brick_type,
    });
    brickId = brickRes.id;

    if (!brickRes) {
      throw new LucidError({
        type: "basic",
        name: "Page Brick Update Error",
        message: "Could not update page brick",
        status: 500,
      });
    }
  } else {
    const brickRes = await CollectionBrick.createSingleBrick({
      type: data.collection.type,
      reference_id: data.reference_id,
      order: data.order,
      brick: data.brick,
      brick_type: data.brick_type,
    });

    brickId = brickRes.id;
    if (!brickRes) {
      throw new LucidError({
        type: "basic",
        name: "Page Brick Create Error",
        message: "Could not create page brick",
        status: 500,
      });
    }
  }

  // for each field, create or update the field, if its a repeater, create or update the repeater and items
  if (!data.brick.fields) return brickId;

  for (const field of data.brick.fields) {
    if (field.type === "tab") continue;

    if (field.type === "repeater")
      promises.push(
        collectionBricksService.upsertRepeater({
          brick_id: brickId,
          data: field,
        })
      );
    else
      promises.push(
        collectionBricksService.upsertField({
          brick_id: brickId,
          data: field,
        })
      );
  }

  await Promise.all(promises);

  return brickId;
};

export default upsertSingleWithFields;
