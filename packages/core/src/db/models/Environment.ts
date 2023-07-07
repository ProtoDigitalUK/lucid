import getDBClient from "@db/db";
import slugify from "slugify";
// Models
import Config from "@db/models/Config";
// Utils
import { LucidError, modelErrors } from "@utils/error-handler";
import { queryDataFormat } from "@utils/query-helpers";
// Services
import formatEnvironment, {
  EnvironmentResT,
} from "@services/environments/format-environment";

// -------------------------------------------
// Types
type EnvironmentGetAll = () => Promise<EnvironmentResT[]>;
type EnvironmentGetSingle = (key: string) => Promise<EnvironmentResT>;
type EnvironmentUpsertSingle = (
  data: {
    key: string;
    title?: string;
    assigned_bricks?: string[];
    assigned_collections?: string[];
    assigned_forms?: string[];
  },
  create: boolean
) => Promise<EnvironmentResT>;

type EnvironmentDeleteSingle = (key: string) => Promise<EnvironmentResT>;

// -------------------------------------------
// User
export type EnvironmentT = {
  key: string;
  title: string | null;

  assigned_bricks: string[] | null;
  assigned_collections: string[] | null;
  assigned_forms: string[] | null;
};

export default class Environment {
  // -------------------------------------------
  // Functions
  static getAll: EnvironmentGetAll = async () => {
    const client = await getDBClient;

    // Get all environments
    const environments = await client.query<EnvironmentT>({
      text: `SELECT *
        FROM 
          lucid_environments
        ORDER BY
          key ASC`,
      values: [],
    });

    return environments.rows.map((environment) =>
      formatEnvironment(environment)
    );
  };
  static getSingle: EnvironmentGetSingle = async (key) => {
    const client = await getDBClient;

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

    return formatEnvironment(environment.rows[0]);
  };
  static upsertSingle: EnvironmentUpsertSingle = async (data, create) => {
    const client = await getDBClient;

    const key = create ? slugify(data.key, { lower: true }) : data.key;

    // if create false, check if environment exists
    if (!create) {
      await Environment.getSingle(key);
    } else {
      await Environment.#checkKeyExists(data.key);
    }

    // Create query from data
    const { columns, aliases, values } = queryDataFormat({
      columns: [
        "key",
        "title",
        "assigned_bricks",
        "assigned_collections",
        "assigned_forms",
      ],
      values: [
        key,
        data.title,
        data.assigned_bricks,
        data.assigned_collections,
        data.assigned_forms,
      ],
    });

    // Check assigned_brick keys against
    if (data.assigned_bricks) {
      await Environment.#checkAssignedBricks(data.assigned_bricks);
    }

    // Check assigned_collection keys against
    if (data.assigned_collections) {
      await Environment.#checkAssignedCollections(data.assigned_collections);
    }

    // Check assigned_form keys against
    if (data.assigned_forms) {
      await Environment.#checkAssignedForms(data.assigned_forms);
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
        message: `Environment with key "${key}" could not be created`,
        status: 400,
      });
    }

    return formatEnvironment(environments.rows[0]);
  };
  static deleteSingle: EnvironmentDeleteSingle = async (key) => {
    const client = await getDBClient;

    // Check if environment exists
    await Environment.getSingle(key);

    // Delete environment
    const environments = await client.query<EnvironmentT>({
      text: `DELETE FROM lucid_environments WHERE key = $1 RETURNING *`,
      values: [key],
    });

    if (environments.rows.length === 0) {
      throw new LucidError({
        type: "basic",
        name: "Environment not deleted",
        message: `Environment with key "${key}" could not be deleted`,
        status: 400,
      });
    }

    return formatEnvironment(environments.rows[0]);
  };
  // -------------------------------------------
  // Util Functions
  static #checkAssignedBricks = async (assigned_bricks: string[]) => {
    const brickInstances = Config.bricks || [];
    const brickKeys = brickInstances.map((b) => b.key);

    const invalidBricks = assigned_bricks.filter((b) => !brickKeys.includes(b));
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
  };
  static #checkAssignedCollections = async (assigned_collections: string[]) => {
    const collectionInstances = Config.collections || [];
    const collectionKeys = collectionInstances.map((c) => c.key);

    const invalidCollections = assigned_collections.filter(
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
  };
  static #checkAssignedForms = async (assigned_forms: string[]) => {
    const formInstances = Config.forms || [];
    const formKeys = formInstances.map((f) => f.key);

    const invalidForms = assigned_forms.filter((f) => !formKeys.includes(f));
    if (invalidForms.length > 0) {
      throw new LucidError({
        type: "basic",
        name: "Invalid form keys",
        message: `Make sure all assigned_forms are valid.`,
        status: 400,
        errors: modelErrors({
          assigned_forms: {
            code: "invalid",
            message: `Make sure all assigned_forms are valid.`,
            children: invalidForms.map((f) => ({
              code: "invalid",
              message: `Form with key "${f}" not found.`,
            })),
          },
        }),
      });
    }
  };
  static #checkKeyExists = async (key: string) => {
    const client = await getDBClient;

    const environments = await client.query<EnvironmentT>({
      text: `SELECT * FROM lucid_environments WHERE key = $1`,
      values: [key],
    });

    if (environments.rows.length > 0) {
      throw new LucidError({
        type: "basic",
        name: "Environment already exists",
        message: `Environment with key "${key}" already exists`,
        status: 400,
      });
    }
  };
}
