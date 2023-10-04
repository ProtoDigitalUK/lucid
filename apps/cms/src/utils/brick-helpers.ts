// Store
import builderStore from "@/store/builderStore";
// Types
import type { BrickConfigT, BrickFieldValueT } from "@lucid/types/src/bricks";
import type { BrickStoreFieldT } from "@/store/builderStore";

// --------------------------------------------
// Build out brick fields based
const brickConfigToStoreFields = (config: BrickConfigT): BrickStoreFieldT[] => {
  // recursively build out the brick fields from the config object for the builder store
  // repeaters values are empty arrays

  const fieldsRes: BrickStoreFieldT[] = [];

  const buildFieldData = (fields: BrickConfigT["fields"]) => {
    if (!fields) return;
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];

      // Skip tabs
      if (field.type === "tab") {
        buildFieldData(field.fields);
        continue;
      }

      // Add repeater
      if (field.type === "repeater") {
        fieldsRes.push({
          key: field.key,
          type: field.type,
          items: [],
        });
        continue;
      }

      // Add field
      fieldsRes.push({
        key: field.key,
        type: field.type,
        value: field.default,
      });
    }
  };
  buildFieldData(config.fields);

  return fieldsRes;
};

// --------------------------------------------
// Format store to update
const formatStoreToSave = () => {
  // recursively formats the brick fields to match the type needed for the update mutation
};

// --------------------------------------------
// Update field in store
const updateFieldValue = (params: {
  type: "builderBricks" | "fixedBricks";
  index: number;
  key: string;
  value: BrickFieldValueT;
}) => {
  const updatedBricks = builderStore.get.builderBricks;
  console.log(updatedBricks);
  const brick = updatedBricks[params.index];

  const field = brick.fields.find((f) => f.key === params.key);
  if (field) {
    field.value = params.value;
  }

  builderStore.set(params.type, updatedBricks);
};

// --------------------------------------------
// Get field value from store
const getFieldValue = (params: {
  type: "builderBricks" | "fixedBricks";
  index: number;
  key: string;
}) => {
  const brick = builderStore.get[params.type][params.index];
  const field = brick?.fields.find((f) => f.key === params.key);
  return field?.value;
};

// ---------------------------------------------
// Exports
const brickHelpers = {
  brickConfigToStoreFields,
  formatStoreToSave,
  updateFieldValue,
  getFieldValue,
};

export default brickHelpers;
