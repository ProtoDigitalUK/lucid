import z from "zod";
import Config from "@db/models/Config";
// Models
import Collection, { CollectionT } from "@db/models/Collection";
import Environment, { EnvironmentT } from "@db/models/Environment";
// Internal packages
import {
  BrickBuilderT,
  CustomField,
  BrickConfigOptionsT,
} from "@lucid/brick-builder";
import { CollectionBrickConfigT } from "@lucid/collection-builder";
// Utils
import { LucidError } from "@utils/error-handler";
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

type BrickConfigGetAll = (
  query: z.infer<typeof bricksSchema.config.getAll.query>,
  data: {
    collection_key: string;
    environment_key: string;
  }
) => Promise<BrickConfigT[]>;

type BrickConfigGetSingle = (data: {
  brick_key: string;
  collection_key: string;
  environment_key: string;
}) => Promise<BrickConfigT>;

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
  static getSingle: BrickConfigGetSingle = async (data) => {
    const allBricks = await BrickConfig.getAll(
      {
        include: ["fields"],
      },
      {
        collection_key: data.collection_key,
        environment_key: data.environment_key,
      }
    );

    const brick = allBricks.find((b) => b.key === data.brick_key);
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
  static getAll: BrickConfigGetAll = async (query, data) => {
    const environment = await Environment.getSingle(data.environment_key);
    const collection = await Collection.getSingle({
      collection_key: data.collection_key,
      environment_key: data.environment_key,
      environment: environment,
    });

    const allowedBricks = BrickConfig.getAllAllowedBricks({
      collection: collection,
      environment: environment,
    });

    if (!query.include?.includes("fields")) {
      allowedBricks.bricks.forEach((brick) => {
        delete brick.fields;
      });
    }

    return allowedBricks.bricks;
  };
  static isBrickAllowed: BrickConfigIsBrickAllowed = (data) => {
    // checks if the brick is allowed in the collection and environment and that there is config for it
    let allowed = false;
    const builderInstances = BrickConfig.getBrickConfig();

    const instance = builderInstances.find((b) => b.key === data.key);
    const envAssigned = (data.environment.assigned_bricks || [])?.includes(
      data.key
    );

    let builderBrick: CollectionBrickConfigT | undefined;
    let fixedBrick: CollectionBrickConfigT | undefined;

    if (!data.type) {
      builderBrick = data.collection.bricks?.find(
        (b) => b.key === data.key && b.type === "builder"
      ) as CollectionBrickConfigT | undefined;

      fixedBrick = data.collection.bricks?.find(
        (b) => b.key === data.key && b.type === "fixed"
      ) as CollectionBrickConfigT | undefined;
    } else {
      const brickF = data.collection.bricks?.find(
        (b) => b.key === data.key && b.type === data.type
      ) as CollectionBrickConfigT | undefined;
      if (data.type === "builder") builderBrick = brickF;
      if (data.type === "fixed") fixedBrick = brickF;
    }

    // Set response data
    if (instance && envAssigned && (builderBrick || fixedBrick)) allowed = true;

    let brick: BrickConfigT | undefined;
    if (instance) {
      brick = BrickConfig.getBrickData(instance, {
        include: ["fields"],
      });
    }

    return {
      allowed: allowed,
      brick: brick,
      collectionBrick: {
        builder: builderBrick,
        fixed: fixedBrick,
      },
    };
  };
  static getAllAllowedBricks: BrickConfigGetAllAllowedBricks = (data) => {
    const allowedBricks: BrickConfigT[] = [];
    const allowedCollectionBricks: CollectionBrickConfigT[] = [];
    const brickConfigData = BrickConfig.getBrickConfig();

    for (const brick of brickConfigData) {
      const brickAllowed = BrickConfig.isBrickAllowed({
        key: brick.key,
        collection: data.collection,
        environment: data.environment,
      });

      if (brickAllowed.allowed && brickAllowed.brick) {
        allowedBricks.push(brickAllowed.brick);
      }
      if (brickAllowed.allowed && brickAllowed.collectionBrick) {
        if (brickAllowed.collectionBrick.builder)
          allowedCollectionBricks.push(brickAllowed.collectionBrick.builder);
        if (brickAllowed.collectionBrick.fixed)
          allowedCollectionBricks.push(brickAllowed.collectionBrick.fixed);
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
    const brickInstances = Config.bricks;

    if (!brickInstances) {
      return [];
    } else {
      return brickInstances;
    }
  };
  static getBrickData = (
    instance: BrickBuilderT,
    query?: z.infer<typeof bricksSchema.config.getAll.query>
  ): BrickConfigT => {
    const data: BrickConfigT = {
      key: instance.key,
      title: instance.title,
      preview: instance.config?.preview,
    };

    if (!query) return data;

    // Include fields
    if (query.include?.includes("fields")) data.fields = instance.fieldTree;

    return data;
  };
}
