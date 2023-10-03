import { createStore } from "solid-js/store";
// Types
import type { BrickFieldT } from "@lucid/types/src/pages";

export interface BrickDataT {
  key: string;
  fields: Array<BrickFieldT>;
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

  updateBrick: (_props: {
    brick: BrickDataT;
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
