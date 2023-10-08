// Models
import {
  BrickObject,
  BrickGroupUpdateObject,
} from "@db/models/CollectionBrick.js";

const formatUpsertGroups = (
  brick: BrickObject
): Array<BrickGroupUpdateObject> => {
  return (
    brick.groups?.map((group) => {
      return {
        group_id: group.group_id,
        group_order: group.group_order,
        collection_brick_id: brick.id,
        ref: group.group_id,
      };
    }) || []
  );
};

export default formatUpsertGroups;
