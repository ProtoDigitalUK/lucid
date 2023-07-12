// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import CollectionBrick, { BrickFieldObject } from "@db/models/CollectionBrick";
// Services
import collectionBricksService from "@services/collection-bricks";

export interface ServiceData {
  brick_id: number;
  data: BrickFieldObject;
}

/*
  Handles the upsert of a standard field
*/

const upsertField = async (data: ServiceData) => {
  let fieldId;
  const brickField = data.data;

  // Check if the field already exists
  await collectionBricksService.checkFieldExists({
    brick_id: data.brick_id,
    key: brickField.key,
    type: brickField.type,
    parent_repeater: brickField.parent_repeater,
    group_position: brickField.group_position,
    create: brickField.fields_id !== undefined ? false : true,
  });

  // Update the field
  if (brickField.fields_id) {
    const fieldRes = await CollectionBrick.updateField(
      data.brick_id,
      brickField
    );
    fieldId = fieldRes.fields_id;
  }
  // Create the field
  else {
    const fieldRes = await CollectionBrick.createField(
      data.brick_id,
      brickField
    );

    if (!fieldRes) {
      throw new LucidError({
        type: "basic",
        name: "Field Create Error",
        message: `Could not create field "${brickField.key}" for brick "${data.brick_id}".`,
        status: 500,
      });
    }
    fieldId = fieldRes.fields_id;
  }

  return fieldId;
};

export default upsertField;
