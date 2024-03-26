import { Kysely, sql, Migration } from "kysely";

const Migration00000001: Migration = {
	async up(db: Kysely<unknown>) {
		await db.schema
			.createTable("headless_languages")
			.addColumn("id", "serial", (col) => col.primaryKey())
			.addColumn("code", "text", (col) => col.notNull().unique())
			.addColumn("is_default", "boolean", (col) =>
				col.notNull().defaultTo(false),
			)
			.addColumn("is_enabled", "boolean", (col) =>
				col.notNull().defaultTo(true),
			)
			.addColumn("created_at", "timestamp", (col) =>
				col.defaultTo(sql`NOW()`),
			)
			.addColumn("updated_at", "timestamp", (col) =>
				col.defaultTo(sql`NOW()`),
			)
			.execute();
	},
	async down(db: Kysely<unknown>) {},
};

export default Migration00000001;
