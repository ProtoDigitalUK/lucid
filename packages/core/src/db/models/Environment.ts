import getDBClient from "@db/db";
// Utils
import { queryDataFormat } from "@utils/app/query-helpers";

// -------------------------------------------
// Types
type EnvironmentGetAll = () => Promise<EnvironmentT[]>;
type EnvironmentGetSingle = (key: string) => Promise<EnvironmentT>;
type EnvironmentUpsertSingle = (data: {
  key: string;
  title?: string;
  assigned_bricks?: string[];
  assigned_collections?: string[];
  assigned_forms?: string[];
}) => Promise<EnvironmentT>;

type EnvironmentDeleteSingle = (key: string) => Promise<EnvironmentT>;

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

    return environments.rows;
  };
  static getSingle: EnvironmentGetSingle = async (key) => {
    const client = await getDBClient;

    const environment = await client.query<EnvironmentT>({
      text: `SELECT * FROM lucid_environments WHERE key = $1`,
      values: [key],
    });

    return environment.rows[0];
  };
  static upsertSingle: EnvironmentUpsertSingle = async (data) => {
    const client = await getDBClient;

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
  static deleteSingle: EnvironmentDeleteSingle = async (key) => {
    const client = await getDBClient;

    const environments = await client.query<EnvironmentT>({
      text: `DELETE FROM lucid_environments WHERE key = $1 RETURNING *`,
      values: [key],
    });

    return environments.rows[0];
  };
  static checkKeyExists = async (key: string) => {
    const client = await getDBClient;

    const environments = await client.query<EnvironmentT>({
      text: `SELECT * FROM lucid_environments WHERE key = $1`,
      values: [key],
    });

    return environments.rows;
  };
}
