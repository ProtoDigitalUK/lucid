import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";

const { Client } = pkg;

const client = new Client({
	connectionString: process.env.DATABASE_URL,
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

	const green = "\x1b[32m";
	const reset = "\x1b[0m";

	console.log(`${green}All tables dropped${reset}`);

	process.exit(0);
};

dropTables();
