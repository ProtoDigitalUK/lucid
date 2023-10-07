import { produce } from "solid-js/store";
// Store
import builderStore, { BrickStoreFieldT } from "@/store/builderStore";
// Types
import type { BrickFieldValueT, CustomFieldT } from "@lucid/types/src/bricks";

// --------------------------------------------
// Format store to update
const formatStoreToSave = () => {
  // recursively formats the brick fields to match the type needed for the update mutation
};

// --------------------------------------------
// Find field index
const findFieldIndex = (params: {
  fields: BrickStoreFieldT[];
  key: string;
  group?: number[];
  repeater?: string;
}) => {
  const fieldIndex = params.fields.findIndex(
    (f) =>
      f.key === params.key &&
      JSON.stringify(f.group) === JSON.stringify(params.group) &&
      f.repeater === params.repeater
  );
  return fieldIndex;
};

// --------------------------------------------
// Update field in store
const updateFieldValue = (params: {
  type: "builderBricks" | "fixedBricks";
  brickIndex: number;
  key: string;
  group?: number[];
  repeater?: string;
  value: BrickFieldValueT;
}) => {
  builderStore.set(
    params.type,
    produce((draft) => {
      const brick = draft[params.brickIndex];
      if (!brick) return;

      const fieldIndex = findFieldIndex({
        fields: brick.fields,
        key: params.key,
        group: params.group,
        repeater: params.repeater,
      });

      if (fieldIndex !== -1) {
        brick.fields[fieldIndex].value = params.value;
      }
    })
  );
};
// --------------------------------------------
// Get field value from store
const getField = (params: {
  type: "builderBricks" | "fixedBricks";
  brickIndex: number;
  field: CustomFieldT;

  key: string;
  group?: number[];
  repeater?: string;
}) => {
  const brick = builderStore.get[params.type][params.brickIndex];
  const fieldIndex = findFieldIndex({
    fields: brick.fields,
    key: params.key,
    group: params.group,
    repeater: params.repeater,
  });
  const field = brick.fields[fieldIndex];
  if (!field) {
    return addField(params);
  }
  return field;
};

// --------------------------------------------
// Add new field to store
const addField = (params: {
  type: "builderBricks" | "fixedBricks";
  brickIndex: number;
  field: CustomFieldT;
  group?: number[];
  group_order?: number;
  repeater?: string;
}) => {
  builderStore.set(
    params.type,
    produce((draft) => {
      const brick = draft[params.brickIndex];
      if (!brick) return;

      const newField = {
        key: params.field.key,
        type: params.field.type,
        value: params.field.default,
        group: params.group,
        group_order: params.group_order,
        repeater: params.repeater,
      };

      brick.fields.push(newField);
    })
  );
};
// ---------------------------------------------
// Exports
const brickHelpers = {
  formatStoreToSave,
  updateFieldValue,
  getField,
  addField,
  findFieldIndex,
};

export default brickHelpers;
