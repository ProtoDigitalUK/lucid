require("dotenv").config();
import { Client } from "pg";

const client = new Client({
  connectionString: process.env.LUCID_DATABASE_URL as string,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

const dropTables = async () => {
  // loop through all tables and drop them
  const tables = await client.query(`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        AND table_name NOT LIKE 'pg_%'
        AND table_name NOT LIKE 'sql_%'
        ORDER BY table_name ASC
      `);
  // @ts-ignore
  for (const table of tables.rows) {
    await client.query(`DROP TABLE IF EXISTS ${table.table_name} CASCADE`);
  }

  process.exit(0);
};

dropTables();
