import { produce } from "solid-js/store";
import shortUUID from "short-uuid";
// Store
import builderStore, {
  BrickStoreFieldT,
  BrickStoreGroupT,
} from "@/store/builderStore";
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
  group_id?: BrickStoreFieldT["group_id"];
}) => {
  const fieldIndex = params.fields.findIndex(
    (f) => f.key === params.key && f.group_id === params.group_id
  );
  return fieldIndex;
};

// --------------------------------------------
// Update field in store
const updateFieldValue = (params: {
  type: "builderBricks" | "fixedBricks";
  brickIndex: number;
  key: string;
  value: BrickFieldValueT;
  group_id?: BrickStoreFieldT["group_id"];
}) => {
  builderStore.set(
    params.type,
    produce((draft) => {
      const brick = draft[params.brickIndex];
      if (!brick) return;

      const fieldIndex = findFieldIndex({
        fields: brick.fields,
        key: params.key,
        group_id: params.group_id,
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
  group_id?: BrickStoreFieldT["group_id"];
  key: string;
}) => {
  const brick = builderStore.get[params.type][params.brickIndex];
  const fieldIndex = findFieldIndex({
    fields: brick.fields,
    key: params.key,
    group_id: params.group_id,
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
  group_id?: BrickStoreFieldT["group_id"];
}) => {
  builderStore.set(
    params.type,
    produce((draft) => {
      const brick = draft[params.brickIndex];
      if (!brick) return;

      const newField: BrickStoreFieldT = {
        key: params.field.key,
        type: params.field.type,
        value: params.field.default,
        group_id: params.group_id,
      };

      brick.fields.push(newField);
    })
  );
};

// --------------------------------------------
// Add new group to repeater
const addGroup = (params: {
  type: "builderBricks" | "fixedBricks";
  brickIndex: number;
  fields: CustomFieldT[];

  repeater_key: string;
  parent_group_id: BrickStoreGroupT["parent_group_id"];
  order: number;
}) => {
  builderStore.set(
    params.type,
    produce((draft) => {
      const brick = draft[params.brickIndex];
      if (!brick) return;
      const newGroup: BrickStoreGroupT = {
        group_id: `ref-${shortUUID.generate()}`,
        repeater_key: params.repeater_key,
        parent_group_id: params.parent_group_id,
        group_order: params.order,
      };

      params.fields.forEach((field) => {
        const newField: BrickStoreFieldT = {
          key: field.key,
          type: field.type,
          value: field.default,
          group_id: newGroup.group_id,
        };
        brick.fields.push(newField);
      });

      brick.groups.push(newGroup);
    })
  );
};

// --------------------------------------------
// Remove group
const removeGroup = (params: {
  type: "builderBricks" | "fixedBricks";
  brickIndex: number;
  group_id: BrickStoreGroupT["group_id"];
}) => {
  builderStore.set(
    params.type,
    produce((draft) => {
      const brick = draft[params.brickIndex];
      if (!brick) return;

      const removeGroupIds = [params.group_id];

      const findChildGroups = (group_id: BrickStoreGroupT["group_id"]) => {
        brick.groups.forEach((group) => {
          if (group.parent_group_id === group_id) {
            removeGroupIds.push(group.group_id);
            findChildGroups(group.group_id);
          }
        });
      };
      findChildGroups(params.group_id);

      brick.groups = brick.groups.filter(
        (group) => !removeGroupIds.includes(group.group_id)
      );
      brick.fields = brick.fields.filter((field) => {
        if (field.group_id) {
          return !removeGroupIds.includes(field.group_id);
        }
      });
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
  addGroup,
  removeGroup,
};

export default brickHelpers;
