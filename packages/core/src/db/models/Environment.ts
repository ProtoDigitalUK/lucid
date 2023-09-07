import { PoolClient } from "pg";
// Utils
import { queryDataFormat } from "@utils/app/query-helpers.js";

// -------------------------------------------
// Types
type EnvironmentGetAll = (client: PoolClient) => Promise<EnvironmentT[]>;
type EnvironmentGetSingle = (
  client: PoolClient,
  data: {
    key: string;
  }
) => Promise<EnvironmentT>;
type EnvironmentUpsertSingle = (
  client: PoolClient,
  data: {
    key: string;
    title?: string;
    assigned_bricks?: string[];
    assigned_collections?: string[];
    assigned_forms?: string[];
  }
) => Promise<EnvironmentT>;

type EnvironmentDeleteSingle = (
  client: PoolClient,
  data: {
    key: string;
  }
) => Promise<EnvironmentT>;

// -------------------------------------------
// Environment
export type EnvironmentT = {
  key: string;
  title: string | null;

  assigned_bricks: string[] | null;
  assigned_collections: string[] | null;
  assigned_forms: string[] | null;
};

export default class Environment {
  static getAll: EnvironmentGetAll = async (client) => {
    // Get all environments
    const environments = await client.query<EnvironmentT>({
      text: `SELECT *
        FROM 
          lucid_environments
        ORDER BY
          key ASC`,
      values: [],
    });

    return environments.rows;
  };
  static getSingle: EnvironmentGetSingle = async (client, data) => {
    const environment = await client.query<EnvironmentT>({
      text: `SELECT * FROM lucid_environments WHERE key = $1`,
      values: [data.key],
    });

    return environment.rows[0];
  };
  static upsertSingle: EnvironmentUpsertSingle = async (client, data) => {
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
        data.key,
        data.title,
        data.assigned_bricks,
        data.assigned_collections,
        data.assigned_forms,
      ],
    });

    // Create or update environment
    const environments = await client.query<EnvironmentT>({
      text: `INSERT INTO lucid_environments (${columns.formatted.insert}) 
        VALUES (${aliases.formatted.insert}) 
        ON CONFLICT (key) 
        DO UPDATE SET ${columns.formatted.doUpdate}
        RETURNING *`,
      values: [...values.value],
    });

    return environments.rows[0];
  };
  static deleteSingle: EnvironmentDeleteSingle = async (client, data) => {
    const environments = await client.query<EnvironmentT>({
      text: `DELETE FROM lucid_environments WHERE key = $1 RETURNING *`,
      values: [data.key],
    });

    return environments.rows[0];
  };
}
