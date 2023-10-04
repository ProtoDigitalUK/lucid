import { createStore } from "solid-js/store";
// Utils
import brickHelpers from "@/utils/brick-helpers";
// Types
import type { FieldTypes } from "@lucid/types/src/pages";
import { BrickConfigT, BrickFieldValueT } from "@lucid/types/src/bricks";

export interface BrickStoreFieldT {
  fields_id?: number;
  key: string;
  type: FieldTypes;
  value?: BrickFieldValueT;
  items?: Array<BrickStoreFieldT[]>;
}

export interface BrickDataT {
  id?: number;
  key: string;
  fields: Array<BrickStoreFieldT>;
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
    config?: BrickConfigT;
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
};

const [get, set] = createStore<BuilderStoreT>({
  builderBricks: [],
  fixedBricks: [],

  reset() {
    set("builderBricks", []);
    set("fixedBricks", []);
  },

  addBrick({ brick, type, config }) {
    let fields = brick.fields;
    if (fields.length === 0 && config) {
      fields = brickHelpers.brickConfigToStoreFields(config);
    }

    set(type, [
      ...get[type],
      {
        key: brick.key,
        fields: fields,
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
});

const builderStore = {
  get,
  set,
};

export default builderStore;
