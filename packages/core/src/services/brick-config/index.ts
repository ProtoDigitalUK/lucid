import { CustomField, BrickConfigOptionsT } from "@lucid/brick-builder";
// Services
import getAll from "./get-all";
import getSingle from "./get-single";
import getBrickConfig from "./get-brick-config";
import isBrickAllowed from "./is-brick-allowed";
import getBrickData from "./get-brick-data";
import getAllAllowedBricks from "./get-all-allowed-bricks";

// -------------------------------------------
// Types
export type BrickConfigT = {
  key: string;
  title: string;
  fields?: CustomField[];
  preview?: BrickConfigOptionsT["preview"];
};

// -------------------------------------------
// Exports
export default {
  getAll,
  getSingle,
  getBrickConfig,
  isBrickAllowed,
  getBrickData,
  getAllAllowedBricks,
};
