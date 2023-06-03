import Fuse from "fuse.js";
import { LucidError } from "@utils/error-handler";
import Config from "@db/models/Config";
// Models
import Collection from "./Collection";
// Internal packages
import { BrickBuilderT, CustomField } from "@lucid/brick-builder";

// -------------------------------------------
// Types
interface QueryParams extends ModelQueryParams {
  include?: Array<"fields">;
  filter?: {
    s?: string;
    collection_key?: Array<string> | string;
  };
  sort?: Array<{
    key: "name";
    value: "asc" | "desc";
  }>;
}

type BrickConfigGetAll = (query: QueryParams) => Promise<BrickConfigT[]>;
type BrickConfigGetSingle = (key: string) => Promise<BrickConfigT>;
type BrickConfigValidData = (data: any) => Promise<boolean>;

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
  static getSingle: BrickConfigGetSingle = async (key) => {
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

    const brickData = BrickConfig.getBrickData(brick);

    return brickData;
  };
  static getAll: BrickConfigGetAll = async (query) => {
    const brickInstance = BrickConfig.getBrickConfig();
    if (!brickInstance) return [];

    const bricks = await Promise.all(
      brickInstance.map((brick) => BrickConfig.getBrickData(brick, query))
    );

    const filteredBricks = await BrickConfig.#filterBricks(
      query.filter,
      bricks
    );
    const sortedBricks = BrickConfig.#sortBricks(query.sort, filteredBricks);

    return sortedBricks;
  };
  // TODO: Return to this method once page builder is implemented and we need to validate single brick data
  static validData: BrickConfigValidData = async (data) => {
    const brickInstances = BrickConfig.getBrickConfig();
    if (!brickInstances) {
      throw new LucidError({
        type: "basic",
        name: "Brick not found",
        message: "We could not find the brick you are looking for.",
        status: 404,
      });
    }

    // Find single brick instance
    const brickInst = brickInstances.find((b) => b.key === data.key);
    if (!brickInst) {
      throw new LucidError({
        type: "basic",
        name: "Brick not found",
        message: "We could not find the brick you are looking for.",
        status: 404,
      });
    }

    // Validate data
    const validatedData = brickInst.validateBrickData(data);

    return validatedData;
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
    query?: QueryParams
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
    filter: QueryParams["filter"],
    bricks: BrickConfigT[]
  ): Promise<BrickConfigT[]> => {
    if (!filter) return bricks;

    let filteredBricks = [...bricks];

    // Run each possible filter
    const keys = Object.keys(filter);
    if (!keys.length) return filteredBricks;

    // get collections
    const collections = await Collection.getAll({});

    keys.forEach((f) => {
      switch (f) {
        case "s":
          const searchQuery = filter[f];
          if (searchQuery)
            filteredBricks = BrickConfig.#searcBricks(
              searchQuery,
              filteredBricks
            );
          break;
        case "collection_key":
          let collectionKeys = filter[f];
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
    sort: QueryParams["sort"],
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
}
