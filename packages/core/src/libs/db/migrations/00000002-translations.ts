import type { Kysely } from "kysely";
import type { MigrationFn } from "../types.js";
import {
	primaryKeyColumnType,
	primaryKeyColumn,
} from "../kysely/column-helpers.js";

const Migration00000002: MigrationFn = (adapter) => {
	return {
		async up(db: Kysely<unknown>) {
			await db.schema
				.createTable("lucid_translation_keys")
				.addColumn("id", primaryKeyColumnType(adapter), (col) =>
					primaryKeyColumn(col, adapter),
				)
				.addColumn("created_at", "timestamp", (col) => col.notNull())
				.execute();

			await db.schema
				.createTable("lucid_translations")
				.addColumn("id", primaryKeyColumnType(adapter), (col) =>
					primaryKeyColumn(col, adapter),
				)
				.addColumn("translation_key_id", "integer", (col) =>
					col
						.references("lucid_translation_keys.id")
						.notNull()
						.onDelete("cascade")
						.onUpdate("cascade"),
				)
				.addColumn("language_id", "integer", (col) =>
					col
						.references("lucid_languages.id")
						.notNull()
						.onDelete("cascade")
						.onUpdate("cascade"),
				)
				.addColumn("value", "text")
				.addUniqueConstraint(
					"lucid_translations_translation_key_id_language_id_unique",
					["translation_key_id", "language_id"],
				)
				.execute();

			await db.schema
				.createIndex("idx_translation_key_language")
				.on("lucid_translations")
				.columns(["translation_key_id", "language_id"])
				.execute();
		},
		async down(db: Kysely<unknown>) {},
	};
};

export default Migration00000002;
