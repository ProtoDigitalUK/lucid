import z from "zod";
import Fuse from "fuse.js";
import { LucidError } from "@utils/error-handler";
import Config from "@db/models/Config";
// Models
import Collection from "./Collection";
import Environment from "@db/models/Environment";
// Internal packages
import { BrickBuilderT, CustomField } from "@lucid/brick-builder";
// Schema
import bricksSchema from "@schemas/bricks";

// -------------------------------------------
// Types
type BrickConfigGetAll = (
  environment_key: string,
  query: z.infer<typeof bricksSchema.getAll.query>
) => Promise<BrickConfigT[]>;
type BrickConfigGetSingle = (
  environment_key: string,
  key: string
) => Promise<BrickConfigT>;

// -------------------------------------------
// Brick Config
export type BrickConfigT = {
  key: string;
  title: string;
  fields?: CustomField[];
};

export default class BrickConfig {
  // -------------------------------------------
  // Methods
  static getSingle: BrickConfigGetSingle = async (environment_key, key) => {
    const brickInstance = BrickConfig.getBrickConfig();
    if (!brickInstance) {
      throw new LucidError({
        type: "basic",
        name: "Brick not found",
        message: "We could not find the brick you are looking for.",
        status: 404,
      });
    }

    const brick = brickInstance.find((b) => b.key === key);
    if (!brick) {
      throw new LucidError({
        type: "basic",
        name: "Brick not found",
        message: "We could not find the brick you are looking for.",
        status: 404,
      });
    }

    const environment = await Environment.getSingle(environment_key);

    if (!environment.assigned_bricks?.includes(brick.key)) {
      throw new LucidError({
        type: "basic",
        name: "Brick not found",
        message: "This brick is not assigned to this environment.",
        status: 404,
      });
    }

    const brickData = BrickConfig.getBrickData(brick);

    return brickData;
  };
  static getAll: BrickConfigGetAll = async (environment_key, query) => {
    const brickInstance = BrickConfig.getBrickConfig();
    if (!brickInstance) return [];

    let bricks = await Promise.all(
      brickInstance.map((brick) => BrickConfig.getBrickData(brick, query))
    );

    if (query.filter?.environment_key) {
      const environment = await Environment.getSingle(
        query.filter.environment_key
      );

      bricks = BrickConfig.#filterEnvironmentBricks(
        environment.assigned_bricks || [],
        bricks
      );
    }

    const filteredBricks = await BrickConfig.#filterBricks(
      query.filter,
      bricks,
      environment_key
    );
    const sortedBricks = BrickConfig.#sortBricks(query.sort, filteredBricks);

    return sortedBricks;
  };
  // -------------------------------------------
  // Util Methods
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

  // -------------------------------------------
  // Query Methods
  static #searcBricks = (
    query: string,
    bricks: BrickConfigT[]
  ): BrickConfigT[] => {
    if (!query) return bricks;

    const fuse = new Fuse(bricks, {
      keys: ["title"],
      threshold: 0.3,
    });

    const searchResults = fuse.search(query);

    return searchResults.map((r) => r.item);
  };
  static #filterBricks = async (
    filter: z.infer<typeof bricksSchema.getAll.query>["filter"],
    bricks: BrickConfigT[],
    environment_key: string
  ): Promise<BrickConfigT[]> => {
    if (!filter) return bricks;

    let filteredBricks = [...bricks];

    // Run each possible filter
    const keys = Object.keys(filter);
    if (!keys.length) return filteredBricks;

    // get collections
    const collections = await Collection.getAll({
      filter: {
        environment_key,
      },
    });

    Object.keys(filter).forEach((f) => {
      switch (f) {
        case "s":
          const searchQuery = filter.s;
          if (searchQuery)
            filteredBricks = BrickConfig.#searcBricks(
              searchQuery,
              filteredBricks
            );
          break;
        case "collection_key":
          let collectionKeys = filter.collection_key;
          if (collectionKeys) {
            // Get all collections
            const permittedBricks: Array<string> = [];

            // If single collection key, convert to array
            if (!Array.isArray(collectionKeys)) {
              collectionKeys = [collectionKeys];
            }

            // Get all bricks from permitted collections
            collectionKeys.forEach((key) => {
              const collection = collections.find((c) => c.key === key);
              if (collection) {
                permittedBricks.push(...collection.bricks);
              }
            });

            // Filter bricks
            filteredBricks = filteredBricks.filter((b) =>
              permittedBricks.includes(b.key)
            );
          }
          break;
        default:
          break;
      }
    });

    return filteredBricks;
  };
  static #sortBricks = (
    sort: z.infer<typeof bricksSchema.getAll.query>["sort"],
    bricks: BrickConfigT[]
  ): BrickConfigT[] => {
    if (!sort) return bricks;

    let sortedBricks = [...bricks];

    // Run each possible sort
    sort.forEach((s) => {
      sortedBricks = sortedBricks.sort((a, b) => {
        switch (s.key) {
          case "name":
            if (s.value === "asc") {
              return a.title.localeCompare(b.title);
            } else {
              return b.title.localeCompare(a.title);
            }
          default:
            return 0;
        }
      });
    });

    return sortedBricks;
  };
  static #filterEnvironmentBricks = (
    environment_bricks: string[],
    bricks: BrickConfigT[]
  ): BrickConfigT[] => {
    if (!environment_bricks) return bricks;
    return bricks.filter((b) => environment_bricks.includes(b.key));
  };
}
