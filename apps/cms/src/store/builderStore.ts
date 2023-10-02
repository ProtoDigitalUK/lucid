import { createStore } from "solid-js/store";
// Types
import type { BrickFieldT } from "@lucid/types/src/pages";

export interface BrickDataT {
  key: string;
  fields: Array<BrickFieldT>;
}

type BuilderStoreT = {
  builder_bricks: Array<BrickDataT>;
  fixed_bricks: Array<BrickDataT>;
  // functions
  reset: () => void;

  addBrick: (_props: {
    brick: BrickDataT;
    type: "builder_bricks" | "fixed_bricks";
  }) => void;

  removeBrick: (_props: {
    index: number;
    type: "builder_bricks" | "fixed_bricks";
  }) => void;

  updateBrick: (_props: {
    brick: BrickDataT;
    index: number;
    type: "builder_bricks" | "fixed_bricks";
  }) => void;
};

const [get, set] = createStore<BuilderStoreT>({
  builder_bricks: [],
  fixed_bricks: [],

  reset() {
    set("builder_bricks", []);
    set("fixed_bricks", []);
  },

  addBrick({ brick, type }) {
    set(type, [...get[type], brick]);
  },

  removeBrick({ index, type }) {
    const bricks = [...get[type]];
    bricks.splice(index, 1);
    set(type, bricks);
  },

  updateBrick({ brick, index, type }) {
    const bricks = [...get[type]];
    bricks[index] = brick;
    set(type, bricks);
  },
});

const builderStore = {
  get,
  set,
};

export default builderStore;
