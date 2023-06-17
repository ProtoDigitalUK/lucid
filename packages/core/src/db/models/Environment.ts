import client from "@db/db";
import { Request } from "express";
// Models
import Config from "@db/models/Config";
// Utils
import { LucidError } from "@utils/error-handler";
import { queryDataFormat, SelectQueryBuilder } from "@utils/query-helpers";

// -------------------------------------------
// Types
type EnvironmentGetAll = () => Promise<EnvironmentT[]>;
type EnvironmentGetSingle = (key: string) => Promise<EnvironmentT>;
type EnvironmentUpsertSingle = (data: {
  key: string;
  title?: string;
  allowed_bricks?: string[];
}) => Promise<EnvironmentT>;

// -------------------------------------------
// User
export type EnvironmentT = {
  id: number;
  key: string;
  title: string;
  allowed_bricks: string[];
};

export default class Environment {
  // -------------------------------------------
  // Methods
  static getAll: EnvironmentGetAll = async () => {
    // Current specific environment
    const environmentConfig = Config.environments;
    const envKeys = environmentConfig.map((e) => e.key);

    const environments = await client.query<EnvironmentT>({
      text: `SELECT * FROM environments WHERE key = ANY($1)`,
      values: [envKeys],
    });

    return environments.rows;
  };
  static getSingle: EnvironmentGetSingle = async (key) => {
    const environment = await client.query<EnvironmentT>({
      text: `SELECT * FROM environments WHERE key = $1`,
      values: [key],
    });

    if (environment.rows.length === 0) {
      throw new LucidError({
        type: "basic",
        name: "Envrionment not found",
        message: `Environment with key "${key}" not found`,
        status: 404,
      });
    }

    return environment.rows[0];
  };
  static upsertSingle: EnvironmentUpsertSingle = async (data) => {
    // Create query from data
    const { columns, aliases, values } = queryDataFormat(
      ["title", "allowed_bricks"],
      [data.title, data.allowed_bricks]
    );

    // Create or update environment
    const environments = await client.query<EnvironmentT>({
      text: `INSERT INTO environments (${columns.formatted.insert}) 
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
