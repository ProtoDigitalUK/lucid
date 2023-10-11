import { createStore, produce } from "solid-js/store";
import shortUUID from "short-uuid";
// Types
import type { FieldTypes } from "@lucid/types/src/pages";
import type { BrickFieldValueT, CustomFieldT } from "@lucid/types/src/bricks";

export interface BrickStoreFieldT {
  fields_id?: number;
  key: string;
  type: FieldTypes;
  value?: BrickFieldValueT;
  group_id?: string | number;
}

export interface BrickStoreGroupT {
  group_id: string | number;
  parent_group_id: null | string | number;
  repeater_key: string;
  group_order: number;
}

export interface BrickDataT {
  id?: number;
  key: string;
  fields: Array<BrickStoreFieldT>;
  groups: Array<BrickStoreGroupT>;
}

export interface FixedBrickDataT extends BrickDataT {
  position: "top" | "bottom";
}

type BuilderStoreT = {
  builderBricks: Array<BrickDataT>;
  fixedBricks: Array<FixedBrickDataT>;
  // functions
  reset: () => void;
  addBrick: (_props: {
    brick: BrickDataT;
    type: "builderBricks" | "fixedBricks";
  }) => void;
  removeBrick: (_props: {
    index: number;
    type: "builderBricks" | "fixedBricks";
  }) => void;
  sortOrder: (_props: {
    type: "builderBricks" | "fixedBricks";
    from: number;
    to: number;
  }) => void;
  findFieldIndex: (_props: {
    fields: BrickStoreFieldT[];
    key: string;
    groupId?: BrickStoreFieldT["group_id"];
  }) => number;
  addField: (_props: {
    type: "builderBricks" | "fixedBricks";
    brickIndex: number;
    field: CustomFieldT;
    groupId?: BrickStoreFieldT["group_id"];
  }) => void;
  updateFieldValue: (_props: {
    type: "builderBricks" | "fixedBricks";
    brickIndex: number;
    key: string;
    value: BrickFieldValueT;
    groupId?: BrickStoreFieldT["group_id"];
  }) => void;
  addGroup: (_props: {
    type: "builderBricks" | "fixedBricks";
    brickIndex: number;
    fields: CustomFieldT[];
    repeaterKey: string;
    parentGroupId: BrickStoreGroupT["parent_group_id"];
    order: number;
  }) => void;
  removeGroup: (_props: {
    type: "builderBricks" | "fixedBricks";
    brickIndex: number;
    groupId: BrickStoreGroupT["group_id"];
  }) => void;
  swapGroupOrder: (_props: {
    type: "builderBricks" | "fixedBricks";
    brickIndex: number;

    groupId: BrickStoreGroupT["group_id"];
    targetGroupId: BrickStoreGroupT["group_id"];
  }) => void;
};

const [get, set] = createStore<BuilderStoreT>({
  builderBricks: [],
  fixedBricks: [],

  reset() {
    set("builderBricks", []);
    set("fixedBricks", []);
  },

  // --------------------------------------------
  // Bricks
  addBrick({ brick, type }) {
    set(type, [
      ...get[type],
      {
        key: brick.key,
        fields: brick.fields,
        groups: brick.groups,
      },
    ]);
  },
  removeBrick({ index, type }) {
    const bricks = [...get[type]];
    bricks.splice(index, 1);
    set(type, bricks);
  },
  sortOrder({ type, from, to }) {
    const bricks = [...get[type]];
    bricks.splice(to, 0, bricks.splice(from, 1)[0]);
    set(type, bricks);
  },
  // --------------------------------------------
  // Fields
  findFieldIndex(params) {
    const fieldIndex = params.fields.findIndex(
      (f) => f.key === params.key && f.group_id === params.groupId
    );
    return fieldIndex;
  },
  addField(params) {
    builderStore.set(
      params.type,
      produce((draft) => {
        const brick = draft[params.brickIndex];
        if (!brick) return;

        const newField: BrickStoreFieldT = {
          key: params.field.key,
          type: params.field.type,
          value: params.field.default,
          group_id: params.groupId,
        };

        brick.fields.push(newField);
      })
    );
  },
  updateFieldValue(params) {
    builderStore.set(
      params.type,
      produce((draft) => {
        const brick = draft[params.brickIndex];
        if (!brick) return;

        const fieldIndex = get.findFieldIndex({
          fields: brick.fields,
          key: params.key,
          groupId: params.groupId,
        });

        if (fieldIndex !== -1) {
          brick.fields[fieldIndex].value = params.value;
        }
      })
    );
  },
  // --------------------------------------------
  // Groups
  addGroup(params) {
    builderStore.set(
      params.type,
      produce((draft) => {
        const brick = draft[params.brickIndex];
        if (!brick) return;
        const newGroup: BrickStoreGroupT = {
          group_id: `ref-${shortUUID.generate()}`,
          repeater_key: params.repeaterKey,
          parent_group_id: params.parentGroupId,
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
  },
  removeGroup(params) {
    builderStore.set(
      params.type,
      produce((draft) => {
        const brick = draft[params.brickIndex];
        if (!brick) return;

        const removeGroupIds = [params.groupId];

        const findChildGroups = (group_id: BrickStoreGroupT["group_id"]) => {
          brick.groups.forEach((group) => {
            if (group.parent_group_id === group_id) {
              removeGroupIds.push(group.group_id);
              findChildGroups(group.group_id);
            }
          });
        };
        findChildGroups(params.groupId);

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
  },
  swapGroupOrder(params) {
    builderStore.set(
      params.type,
      produce((draft) => {
        const brick = draft[params.brickIndex];
        if (!brick) return;

        const groupIndex = brick.groups.findIndex(
          (group) => group.group_id === params.groupId
        );
        const targetGroupIndex = brick.groups.findIndex(
          (group) => group.group_id === params.targetGroupId
        );

        if (groupIndex === -1 || targetGroupIndex === -1) return;

        const groupOrder = brick.groups[groupIndex].group_order;
        brick.groups[groupIndex].group_order =
          brick.groups[targetGroupIndex].group_order;
        brick.groups[targetGroupIndex].group_order = groupOrder;
      })
    );
  },
});

const builderStore = {
  get,
  set,
};

export default builderStore;
