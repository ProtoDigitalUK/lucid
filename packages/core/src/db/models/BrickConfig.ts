import z from "zod";
import Config from "@db/models/Config";
// Models
import { CollectionT } from "@db/models/Collection";
import { EnvironmentT } from "@db/models/Environment";
// Internal packages
import {
  BrickBuilderT,
  CustomField,
  BrickConfigOptionsT,
} from "@lucid/brick-builder";
import { CollectionBrickConfigT } from "@lucid/collection-builder";
// Schema
import bricksSchema from "@schemas/bricks";

// -------------------------------------------
// Types
type BrickConfigIsBrickAllowed = (data: {
  key: string;
  collection: CollectionT;
  environment: EnvironmentT;
  type?: CollectionBrickConfigT["type"];
}) => {
  allowed: boolean;
  brick?: BrickConfigT;
  collectionBrick?: {
    builder?: CollectionBrickConfigT;
    fixed?: CollectionBrickConfigT;
  };
};

type BrickConfigGetAllAllowedBricks = (data: {
  collection: CollectionT;
  environment: EnvironmentT;
}) => {
  bricks: BrickConfigT[];
  collectionBricks: CollectionBrickConfigT[];
};

// -------------------------------------------
// Brick Config
export type BrickConfigT = {
  key: string;
  title: string;
  fields?: CustomField[];
  preview?: BrickConfigOptionsT["preview"];
};

export default class BrickConfig {
  // -------------------------------------------
  // Functions
}
