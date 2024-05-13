import { sql, type Kysely } from "kysely";
import { AdapterType, type MigrationFn } from "../types.js";
import { defaultTimestamp } from "../kysely/column-helpers.js";

const Migration00000001: MigrationFn = (adapter) => {
	return {
		async up(db: Kysely<unknown>) {
			if (adapter === AdapterType.POSTGRES) {
				await sql`CREATE EXTENSION IF NOT EXISTS pg_trgm`.execute(db);
			}

			await db.schema
				.createTable("lucid_languages")
				.addColumn("code", "text", (col) => col.primaryKey())
				.addColumn("is_default", "integer", (col) =>
					col.notNull().defaultTo(0),
				)
				.addColumn("is_enabled", "integer", (col) =>
					col.notNull().defaultTo(1),
				)
				.addColumn("created_at", "timestamp", (col) =>
					defaultTimestamp(col, adapter),
				)
				.addColumn("updated_at", "timestamp", (col) =>
					defaultTimestamp(col, adapter),
				)
				.execute();
		},
		async down(db: Kysely<unknown>) {},
	};
};

export default Migration00000001;
