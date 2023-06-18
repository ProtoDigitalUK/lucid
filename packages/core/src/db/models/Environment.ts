import client from "@db/db";
// Models
import Config from "@db/models/Config";
// Utils
import { LucidError, modelErrors } from "@utils/error-handler";
import { queryDataFormat } from "@utils/query-helpers";

// -------------------------------------------
// Types
type EnvironmentGetAll = () => Promise<EnvironmentT[]>;
type EnvironmentGetSingle = (key: string) => Promise<EnvironmentT>;
type EnvironmentUpsertSingle = (data: {
  key: string;
  title?: string;
  assigned_bricks?: string[];
  assigned_collections?: string[];
}) => Promise<EnvironmentT>;

// -------------------------------------------
// User
export type EnvironmentT = {
  key: string;
  title: string | null;
  assigned_bricks: string[] | null;
  assigned_collections: string[] | null;
};

export default class Environment {
  // -------------------------------------------
  // Methods
  static getAll: EnvironmentGetAll = async () => {
    // Current specific environment
    const environmentConfig = Config.environments;
    const envKeys = environmentConfig.map((e) => e.key);

    const environments = await client.query<EnvironmentT>({
      text: `SELECT * FROM lucid_environments WHERE key = ANY($1)`,
      values: [envKeys],
    });

    return environments.rows;
  };
  static getSingle: EnvironmentGetSingle = async (key) => {
    const environment = await client.query<EnvironmentT>({
      text: `SELECT * FROM lucid_environments WHERE key = $1`,
      values: [key],
    });

    if (environment.rows.length === 0) {
      throw new LucidError({
        type: "basic",
        name: "Environment not found",
        message: `Environment with key "${key}" not found`,
        status: 404,
      });
    }

    return environment.rows[0];
  };
  static upsertSingle: EnvironmentUpsertSingle = async (data) => {
    // Create query from data
    const { columns, aliases, values } = queryDataFormat(
      ["key", "title", "assigned_bricks", "assigned_collections"],
      [data.key, data.title, data.assigned_bricks, data.assigned_collections]
    );

    // Check assigned_brick keys against config
    if (data.assigned_bricks) {
      const brickInstances = Config.get().bricks || [];
      const brickKeys = brickInstances.map((b) => b.key);

      const invalidBricks = data.assigned_bricks.filter(
        (b) => !brickKeys.includes(b)
      );
      if (invalidBricks.length > 0) {
        throw new LucidError({
          type: "basic",
          name: "Invalid brick keys",
          message: `Make sure all assigned_bricks are valid.`,
          status: 400,
          errors: modelErrors({
            assigned_bricks: {
              code: "invalid",
              message: `Make sure all assigned_bricks are valid.`,
              children: invalidBricks.map((b) => ({
                code: "invalid",
                message: `Brick with key "${b}" not found.`,
              })),
            },
          }),
        });
      }
    }

    // Check assigned_collection keys against config
    if (data.assigned_collections) {
      const collectionInstances = Config.get().collections || [];
      const collectionKeys = collectionInstances.map((c) => c.key);

      const invalidCollections = data.assigned_collections.filter(
        (c) => !collectionKeys.includes(c)
      );
      if (invalidCollections.length > 0) {
        throw new LucidError({
          type: "basic",
          name: "Invalid collection keys",
          message: `Make sure all assigned_collections are valid.`,
          status: 400,
          errors: modelErrors({
            assigned_collections: {
              code: "invalid",
              message: `Make sure all assigned_collections are valid.`,
              children: invalidCollections.map((c) => ({
                code: "invalid",
                message: `Collection with key "${c}" not found.`,
              })),
            },
          }),
        });
      }
    }

    // Create or update environment
    const environments = await client.query<EnvironmentT>({
      text: `INSERT INTO lucid_environments (${columns.formatted.insert}) 
        VALUES (${aliases.formatted.insert}) 
        ON CONFLICT (key) 
        DO UPDATE SET ${columns.formatted.doUpdate}
        RETURNING *`,
      values: [...values.value],
    });

    if (environments.rows.length === 0) {
      throw new LucidError({
        type: "basic",
        name: "Environment not created",
        message: `Environment with key "${data.key}" could not be created`,
        status: 400,
      });
    }

    return environments.rows[0];
  };
  // -------------------------------------------
  // Util Methods
}
