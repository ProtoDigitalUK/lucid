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
  const bricks = [...builderStore.get[params.type]];
  const brick = { ...bricks[params.brickIndex] };

  const fieldIndex = findFieldIndex({
    fields: brick.fields,
    key: params.key,
    group: params.group,
    repeater: params.repeater,
  });

  if (fieldIndex !== -1) {
    const fieldsCopy = [...brick.fields]; // Create a shallow copy of the fields
    const fieldCopy = { ...fieldsCopy[fieldIndex] }; // Copy the specific field you want to update

    fieldCopy.value = params.value; // Update the field copy
    fieldsCopy[fieldIndex] = fieldCopy; // Update the field in the fields array copy

    brick.fields = fieldsCopy; // Update the brick with the modified fields array
    bricks[params.brickIndex] = brick; // Update the bricks array with the modified brick

    builderStore.set(params.type, bricks);
  }
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
  repeater?: string;
}) => {
  const bricks = [...builderStore.get[params.type]];
  const brick = { ...bricks[params.brickIndex] };
  const fields = [...brick.fields];

  const field = {
    key: params.field.key,
    type: params.field.type,
    value: params.field.default,
    group: params.group,
    repeater: params.repeater,
  };

  fields.push(field);
  brick.fields = fields;

  bricks[params.brickIndex] = brick;
  builderStore.set(params.type, bricks);

  return field;
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
