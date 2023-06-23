import z from "zod";
import Config from "@db/models/Config";
// Models
import Collection, { CollectionT } from "@db/models/Collection";
import Environment, { EnvironmentT } from "@db/models/Environment";
// Internal packages
import { BrickBuilderT, CustomField } from "@lucid/brick-builder";
import { CollectionBrickT } from "@lucid/collection-builder";
// Utils
import { LucidError } from "@utils/error-handler";
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
  brick?: BrickConfigT;
  collectionBrick?: CollectionBrickT;
};

type BrickConfigGetAll = (
  collection_key: string,
  environment_key: string,
  query: z.infer<typeof bricksSchema.getAll.query>
) => Promise<BrickConfigT[]>;

type BrickConfigGetSingle = (
  brick_key: string,
  collection_key: string,
  environment_key: string
) => Promise<BrickConfigT>;

type BrickConfigGetAllAllowedBricks = (data: {
  collection: CollectionT;
  environment: EnvironmentT;
}) => {
  bricks: BrickConfigT[];
  collectionBricks: CollectionBrickT[];
};

// -------------------------------------------
// Brick Config
export type BrickConfigT = {
  key: string;
  title: string;
  fields?: CustomField[];
};

export default class BrickConfig {
  // -------------------------------------------
  // Functions
  static getSingle: BrickConfigGetSingle = async (
    brick_key,
    collection_key,
    environment_key
  ) => {
    const allBricks = await BrickConfig.getAll(
      collection_key,
      environment_key,
      {
        include: ["fields"],
      }
    );

    const brick = allBricks.find((b) => b.key === brick_key);
    if (!brick) {
      throw new LucidError({
        type: "basic",
        name: "Brick not found",
        message: "We could not find the brick you are looking for.",
        status: 404,
      });
    }

    return brick;
  };
  static getAll: BrickConfigGetAll = async (
    collection_key,
    environment_key,
    query
  ) => {
    // get collections
    const collection = await Collection.getSingle({
      collection_key: collection_key,
      environment_key: environment_key,
    });
    const environments = await Environment.getSingle(environment_key);

    const allowedBricks = BrickConfig.getAllAllowedBricks({
      collection: collection,
      environment: environments,
    });

    if (!query.include?.includes("fields")) {
      allowedBricks.bricks.forEach((brick) => {
        delete brick.fields;
      });
    }

    return allowedBricks.bricks;
  };
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
      };
    }

    return {
      allowed: allowed,
      brick: brick,
      collectionBrick: collectionBrick,
    };
  };
  static getAllAllowedBricks: BrickConfigGetAllAllowedBricks = (data) => {
    const allowedBricks: BrickConfigT[] = [];
    const allowedCollectionBricks: CollectionBrickT[] = [];
    const brickConfigData = BrickConfig.getBrickConfig();

    for (const brick of brickConfigData) {
      const brickAllowed = BrickConfig.isBrickAllowed(brick.key, {
        collection: data.collection,
        environment: data.environment,
      });

      if (brickAllowed.allowed && brickAllowed.brick) {
        allowedBricks.push(brickAllowed.brick);
      }
      if (brickAllowed.allowed && brickAllowed.collectionBrick) {
        allowedCollectionBricks.push(brickAllowed.collectionBrick);
      }
    }
    return {
      bricks: allowedBricks,
      collectionBricks: allowedCollectionBricks,
    };
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
