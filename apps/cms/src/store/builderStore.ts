import { createStore } from "solid-js/store";
// Types
import type { BrickFieldT } from "@lucid/types/src/pages";

interface BrickDataT {
  key: string;
  fields: Array<BrickFieldT>;
}

type BuilderStoreT = {
  builder_bricks: Array<BrickDataT>;
  fixed_bricks: Array<BrickDataT>;
  // functions
  reset: () => void;

  addBrick: (props: {
    brick: BrickDataT;
    type: "builder_bricks" | "fixed_bricks";
  }) => void;
  removeBrick: (props: {
    index: number;
    type: "builder_bricks" | "fixed_bricks";
  }) => void;
  updateBrick: (props: {
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
    const bricks = get[type];
    bricks.push(brick);
    set(type, bricks);
  },
  removeBrick({ index, type }) {
    const bricks = get[type];
    bricks.splice(index, 1);
    set(type, bricks);
  },
  updateBrick({ brick, index, type }) {
    const bricks = get[type];
    bricks[index] = brick;
    set(type, bricks);
  },
});

const builderStore = {
  get,
  set,
};

export default builderStore;
