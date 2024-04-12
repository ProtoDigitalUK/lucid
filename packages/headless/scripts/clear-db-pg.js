// @ts-check
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

const dropEnums = async () => {
	const enums = await client.query(`
      SELECT t.typname AS enum_name
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid  
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public'
      GROUP BY enum_name
    `);

	for (const enumType of enums.rows) {
		await client.query(
			`DROP TYPE IF EXISTS "${enumType.enum_name}" CASCADE`,
		);
	}

	console.log("\x1b[32mAll enums dropped\x1b[0m");
};

const dropTables = async () => {
	const tables = await client.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
    AND table_name NOT LIKE 'pg_%'
    AND table_name NOT LIKE 'sql_%'
    ORDER BY table_name ASC
    `);
	for (const table of tables.rows) {
		await client.query(
			`DROP TABLE IF EXISTS "${table.table_name}" CASCADE`,
		);
	}

	console.log("\x1b[32mAll tables dropped\x1b[0m");
};

const dropAll = async () => {
	await dropTables();
	await dropEnums();
	process.exit(0);
};

dropAll();
