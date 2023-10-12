// Store
import builderStore, { BrickStoreFieldT } from "@/store/builderStore";
// Types
import type { CustomFieldT } from "@lucid/types/src/bricks";

// --------------------------------------------
// Get field value from store
const getField = (params: {
  brickIndex: number;
  field: CustomFieldT;
  groupId?: BrickStoreFieldT["group_id"];
  key: string;
}) => {
  const brick = builderStore.get.bricks[params.brickIndex];
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

// --------------------------------------------
// Get next brick order
const getNextBrickOrder = (type: "fixed" | "builder") => {
  // get the greatest order number from bricks
  const bricks = builderStore.get.bricks.filter((b) => b.type === type);
  if (bricks.length === 0) return 0;

  const greatestOrder = bricks.reduce((acc, curr) => {
    if (!curr.order) return acc;
    if (curr.order > acc) return curr.order;
    return acc;
  }, 0);

  return greatestOrder + 1;
};

// ---------------------------------------------
// Exports
const brickHelpers = {
  getField,
  getNextBrickOrder,
};

export default brickHelpers;
