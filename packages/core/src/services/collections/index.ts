import { CollectionConfigT } from "@lucid/collection-builder";
// Services
import getSingle from "./get-single";
import getAll from "./get-all";
import updateBricks from "./update-bricks";
import format from "./format";

// -------------------------------------------
// Types
export type CollectionT = {
  key: CollectionConfigT["key"];
  title: CollectionConfigT["title"];
  singular: CollectionConfigT["singular"];
  description: CollectionConfigT["description"];
  type: CollectionConfigT["type"];

  bricks?: CollectionConfigT["bricks"];
};

// -------------------------------------------
// Exports
export default {
  getSingle,
  getAll,
  updateBricks,
  format,
};
