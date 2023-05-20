import sql from "@db/db";

export type MigrationT = {
  id: string;
  file: string;
  created_at: string;
};

export default class Migration {
  constructor() {}
  static async all() {
    try {
      const migrations = await sql<MigrationT[]>`SELECT * FROM migrations`;
      return migrations;
    } catch (err) {
      // as this is never used within the app, we dont throw an error to the request
      return [];
    }
  }
}
