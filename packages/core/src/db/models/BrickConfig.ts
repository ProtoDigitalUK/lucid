import z from "zod";
import Config from "@db/models/Config";
// Models
import { CollectionT } from "@db/models/Collection";
import { EnvironmentT } from "@db/models/Environment";
// Internal packages
import { BrickBuilderT, CustomField } from "@lucid/brick-builder";
import { CollectionBrickT } from "@lucid/collection-builder";
// Schema
import bricksSchema from "@schemas/bricks";

// -------------------------------------------
// Types
type BrickConfigIsBrickAllowed = (
  key: string,
  data: {
    collection: CollectionT;
    environment: EnvironmentT;
  },
  type?: CollectionBrickT["type"]
) => {
  allowed: boolean;
  collectionBrick?: CollectionBrickT;
  brick?: BrickConfigT;
};

type BrickConfigGetAllAllowedBricks = (data: {
  collection: CollectionT;
  environment: EnvironmentT;
}) => BrickConfigT[];

// -------------------------------------------
// Brick Config
export type BrickConfigT = {
  key: string;
  title: string;
  fields?: CustomField[];
  collection_meta?: {
    type?: CollectionBrickT["type"];
    position?: CollectionBrickT["position"];
  };
};

export default class BrickConfig {
  // -------------------------------------------
  // Functions
  static isBrickAllowed: BrickConfigIsBrickAllowed = (key, data, type) => {
    // checks if the brick is allowed in the collection and environment and that there is config for it
    let allowed = false;
    const builderInstances = BrickConfig.getBrickConfig();

    const instance = builderInstances.find((b) => b.key === key);
    const envAssigned = (data.environment.assigned_bricks || [])?.includes(key);
    let collectionBrick: CollectionBrickT | undefined;

    if (!type) {
      collectionBrick = data.collection.bricks?.find((b) => b.key === key) as
        | CollectionBrickT
        | undefined;
    } else {
      collectionBrick = data.collection.bricks?.find(
        (b) => b.key === key && b.type === type
      ) as CollectionBrickT | undefined;
    }

    // Set response data
    if (instance && envAssigned && collectionBrick) allowed = true;

    let brick: BrickConfigT | undefined;
    if (instance) {
      brick = {
        key: instance.key,
        title: instance.title,
        fields: instance.fieldTree,
        collection_meta: {
          type: collectionBrick?.type,
          position: collectionBrick?.position,
        },
      };
    }

    return {
      allowed: allowed,
      brick: brick,
    };
  };
  static getAllAllowedBricks: BrickConfigGetAllAllowedBricks = (data) => {
    const allowedBricks: BrickConfigT[] = [];
    const brickConfigData = BrickConfig.getBrickConfig();

    for (const brick of brickConfigData) {
      const brickAllowed = BrickConfig.isBrickAllowed(brick.key, {
        collection: data.collection,
        environment: data.environment,
      });

      if (brickAllowed.allowed && brickAllowed.brick) {
        allowedBricks.push(brickAllowed.brick);
      }
    }
    return allowedBricks;
  };
  // -------------------------------------------
  // Util Functions
  static getBrickConfig = (): BrickBuilderT[] => {
    const brickInstances = Config.get().bricks;

    if (!brickInstances) {
      return [];
    } else {
      return brickInstances;
    }
  };
  static getBrickData = (
    instance: BrickBuilderT,
    query?: z.infer<typeof bricksSchema.getAll.query>
  ): BrickConfigT => {
    const data: BrickConfigT = {
      key: instance.key,
      title: instance.title,
    };

    if (!query) return data;

    // Include fields
    if (query.include?.includes("fields")) data.fields = instance.fieldTree;

    return data;
  };
}
