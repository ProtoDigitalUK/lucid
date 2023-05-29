import Fuse from "fuse.js";
import { Request } from "express";
import { LucidError } from "@utils/error-handler";
// Internal packages
import { BrickBuilderT, CustomField } from "@lucid/brick-builder";

// -------------------------------------------
// Types
interface QueryParams extends ModelQueryParams {
  include?: Array<"fields">;
  exclude?: Array<string>;
  filter?: {
    s?: string;
  };
  sort?: Array<{
    key: "name";
    value: "asc" | "desc";
  }>;
}

type BrickConfigGetAll = (
  req: Request,
  query: QueryParams
) => Promise<BrickConfigT[]>;
type BrickConfigGetSingle = (
  req: Request,
  key: string
) => Promise<BrickConfigT>;
type BrickConfigValidData = (req: Request, data: any) => Promise<boolean>;

// -------------------------------------------
// User
export type BrickConfigT = {
  key: string;
  title: string;
  fields?: CustomField[];
};

export default class BrickConfig {
  // -------------------------------------------
  // Methods
  static getSingle: BrickConfigGetSingle = async (req, key) => {
    const brickInstance = BrickConfig.getBrickConfig(req);
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
  static getAll: BrickConfigGetAll = async (req, query) => {
    const brickInstance = BrickConfig.getBrickConfig(req);
    if (!brickInstance) return [];

    const bricks = await Promise.all(
      brickInstance.map((brick) => BrickConfig.getBrickData(brick, query))
    );

    const filteredBricks = BrickConfig.filterBricks(query.filter, bricks);
    const sortedBricks = BrickConfig.sortBricks(query.sort, filteredBricks);

    return sortedBricks;
  };
  // TODO: Return to this method once page builder is implemented and we need to validate single brick data
  static validData: BrickConfigValidData = async (req, data) => {
    const brickInstances = BrickConfig.getBrickConfig(req);
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
  static getBrickConfig = (req: Request): BrickBuilderT[] => {
    const brickInstances = req.app.get("bricks") as BrickBuilderT[];

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
    // Exclude fields
    // if (query.exclude?.includes("fields")) delete data.fields;

    return data;
  };

  // -------------------------------------------
  // Query Methods
  static searcBricks = (
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
  static filterBricks = (
    filter: QueryParams["filter"],
    bricks: BrickConfigT[]
  ): BrickConfigT[] => {
    if (!filter) return bricks;

    let filteredBricks = [...bricks];

    // Run each possible filter
    Object.keys(filter).forEach((f) => {
      switch (f) {
        case "s":
          const searchQuery = filter[f];
          if (searchQuery)
            filteredBricks = BrickConfig.searcBricks(
              searchQuery,
              filteredBricks
            );
          break;
        default:
          break;
      }
    });

    return filteredBricks;
  };
  static sortBricks = (
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
