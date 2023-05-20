require("dotenv").config();
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL as string, {
  ssl: {
    rejectUnauthorized: false,
  },
});

const dropTables = async () => {
  // loop through all tables and drop them
  const tables = await sql`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        AND table_name NOT LIKE 'pg_%'
        AND table_name NOT LIKE 'sql_%'
        ORDER BY table_name ASC
        `;
  for (const table of tables) {
    await sql`DROP TABLE ${sql(table.table_name)} CASCADE`;
  }

  process.exit(0);
};

dropTables();
