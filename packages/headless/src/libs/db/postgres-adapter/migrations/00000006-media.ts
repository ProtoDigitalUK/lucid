import { Kysely, sql, Migration } from "kysely";

const Migration00000006: Migration = {
	async up(db: Kysely<unknown>) {
		await db.schema
			.createTable("headless_media")
			.addColumn("id", "serial", (col) => col.primaryKey())
			.addColumn("key", "text", (col) => col.unique().notNull())
			.addColumn("e_tag", "text")
			.addColumn("visible", "boolean", (col) =>
				col.notNull().defaultTo(true),
			)
			.addColumn("type", "text", (col) => col.notNull())
			.addColumn("mime_type", "text", (col) => col.notNull())
			.addColumn("file_extension", "text", (col) => col.notNull())
			.addColumn("file_size", "integer", (col) => col.notNull())
			.addColumn("width", "integer")
			.addColumn("height", "integer")
			.addColumn("title_translation_key_id", "integer", (col) =>
				col
					.references("headless_translation_keys.id")
					.onDelete("set null")
					.onUpdate("cascade"),
			)
			.addColumn("alt_translation_key_id", "integer", (col) =>
				col
					.references("headless_translation_keys.id")
					.onDelete("set null")
					.onUpdate("cascade"),
			)
			.addColumn("created_at", "timestamp", (col) =>
				col.defaultTo(sql`NOW()`),
			)
			.addColumn("updated_at", "timestamp", (col) =>
				col.defaultTo(sql`NOW()`),
			)
			.execute();

		await db.schema
			.createTable("headless_processed_images")
			.addColumn("key", "text", (col) => col.primaryKey())
			.addColumn("media_key", "text", (col) =>
				col
					.references("headless_media.key")
					.onDelete("set null")
					.onUpdate("cascade"),
			)
			.execute();

		await db.schema
			.createIndex("idx_media_key")
			.on("headless_processed_images")
			.column("media_key")
			.execute();
	},
	async down(db: Kysely<unknown>) {},
};

export default Migration00000006;
