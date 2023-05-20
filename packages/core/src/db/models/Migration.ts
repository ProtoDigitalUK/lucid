import sql from "@db/db";

// -------------------------------------------
// Types
interface CreateMigrationT {
  file: string;
  rawSql: string;
}

// -------------------------------------------
// Migration
export type MigrationT = {
  id: string;
  file: string;
  created_at: string;
};

export default class Migration {
  // -------------------------------------------
  // Public
  static all = async () => {
    try {
      const migrations = await sql<
        MigrationT[]
      >`SELECT * FROM lucid_migrations`;
      return migrations;
    } catch (err) {
      // as this is never used within the app, we dont throw an error to the request
      return [];
    }
  };
  static create = async (data: CreateMigrationT) => {
    const { file, rawSql } = data;
    await sql.begin(async (sql) => {
      await sql.unsafe(rawSql);
      await sql`INSERT INTO lucid_migrations (file) VALUES (${file})`;
    });
  };
  // -------------------------------------------
  // Util Methods
}
