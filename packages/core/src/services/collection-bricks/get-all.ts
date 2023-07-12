// Models
import CollectionBrick from "@db/models/CollectionBrick";
// Format
import { CollectionResT } from "@utils/format/format-collections";
import formatBricks from "@utils/format/format-bricks";
// Services
import collectionBricksService from "@services/collection-bricks";

export interface ServiceData {
  reference_id: number;
  type: CollectionResT["type"];
  environment_key: string;
  collection: CollectionResT;
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

  const formmatedBricks = await formatBricks({
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
