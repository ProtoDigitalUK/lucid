// Store
import builderStore, { BrickStoreFieldT } from "@/store/builderStore";
// Types
import type { CustomFieldT } from "@lucid/types/src/bricks";

// --------------------------------------------
// Get field value from store
const getField = (params: {
  type: "builderBricks" | "fixedBricks";
  brickIndex: number;
  field: CustomFieldT;
  groupId?: BrickStoreFieldT["group_id"];
  key: string;
}) => {
  const brick = builderStore.get[params.type][params.brickIndex];
  const fieldIndex = builderStore.get.findFieldIndex({
    fields: brick.fields,
    key: params.key,
    groupId: params.groupId,
  });
  const field = brick.fields[fieldIndex];
  if (!field) {
    return builderStore.get.addField(params);
  }
  return field;
};

// ---------------------------------------------
// Exports
const brickHelpers = {
  getField,
};

export default brickHelpers;
