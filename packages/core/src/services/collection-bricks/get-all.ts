// Models
import CollectionBrick from "@db/models/CollectionBrick";
// Services
import { CollectionT } from "@services/collections";
import collectionBricksService from "@services/collection-bricks";

export interface ServiceData {
  reference_id: number;
  type: CollectionT["type"];
  environment_key: string;
  collection: CollectionT;
}

/*
    Get all bricks for a page, of either type "builder" or "fixed", along with all of its fields.

    Then format the bricks and fields into a format that can be used by the frontend.
*/

const getAll = async (data: ServiceData) => {
  const brickFields = await CollectionBrick.getAll({
    reference_id: data.reference_id,
    type: data.type,
  });

  if (!brickFields) {
    return {
      builder_bricks: [],
      fixed_bricks: [],
    };
  }

  const formmatedBricks = await collectionBricksService.formatBricks({
    brick_fields: brickFields,
    environment_key: data.environment_key,
    collection: data.collection,
  });

  return {
    builder_bricks: formmatedBricks.filter((brick) => brick.type === "builder"),
    fixed_bricks: formmatedBricks.filter((brick) => brick.type !== "builder"),
  };
};

export default getAll;
