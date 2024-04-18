import type { Kysely } from "kysely";
import type { MigrationFn } from "../types.js";
import {
	defaultTimestamp,
	primaryKeyColumnType,
	primaryKeyColumn,
} from "../kysely/column-helpers.js";

const Migration00000006: MigrationFn = (adapter) => {
	return {
		async up(db: Kysely<unknown>) {
			await db.schema
				.createTable("headless_media")
				.addColumn("id", primaryKeyColumnType(adapter), (col) =>
					primaryKeyColumn(col, adapter),
				)
				.addColumn("key", "text", (col) => col.unique().notNull())
				.addColumn("e_tag", "text")
				.addColumn("visible", "integer", (col) =>
					col.notNull().defaultTo(1),
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
					defaultTimestamp(col, adapter),
				)
				.addColumn("updated_at", "timestamp", (col) =>
					defaultTimestamp(col, adapter),
				)
				.execute();

			await db.schema
				.createTable("headless_processed_images")
				.addColumn("key", "text", (col) => col.primaryKey())
				.addColumn("media_key", "text", (col) =>
					col
						.references("headless_media.key")
						.onDelete("cascade")
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
};

export default Migration00000006;
