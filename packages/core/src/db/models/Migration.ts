import { PoolClient } from "pg";

// -------------------------------------------
// Types
type MigrationAll = (client: PoolClient) => Promise<MigrationT[]>;

type MigrationCreate = (
  client: PoolClient,
  data: {
    file: string;
    rawSql: string;
  }
) => Promise<void>;

// -------------------------------------------
// Migration
export type MigrationT = {
  id: string;
  file: string;
  created_at: string;
};

export default class Migration {
  static all: MigrationAll = async (client) => {
    try {
      const migrations = await client.query<MigrationT>(
        `SELECT * FROM headless_migrations`
      );
      return migrations.rows;
    } catch (err) {
      // as this is never used within the app, we dont throw an error to the request
      return [];
    }
  };
  static create: MigrationCreate = async (client, data) => {
    const { file, rawSql } = data;
    await client.query({
      text: rawSql,
    });
    await client.query({
      text: `INSERT INTO headless_migrations (file) VALUES ($1)`,
      values: [file],
    });
  };
}
