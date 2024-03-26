import { Kysely, sql, Migration } from "kysely";

const Migration00000002: Migration = {
	async up(db: Kysely<unknown>) {
		await db.schema
			.createTable("headless_translation_keys")
			.addColumn("id", "serial", (col) => col.primaryKey())
			.execute();

		await db.schema
			.createTable("headless_translations")
			.addColumn("id", "serial", (col) => col.primaryKey())
			.addColumn("translation_key_id", "integer", (col) =>
				col
					.references("headless_translation_keys.id")
					.notNull()
					.onDelete("cascade")
					.onUpdate("cascade"),
			)
			.addColumn("language_id", "integer", (col) =>
				col
					.references("headless_languages.id")
					.notNull()
					.onDelete("cascade")
					.onUpdate("cascade"),
			)
			.addColumn("value", "text")
			.addUniqueConstraint(
				"headless_translations_translation_key_id_language_id_unique",
				["translation_key_id", "language_id"],
			)
			.execute();

		await db.schema
			.createIndex("idx_translation_key_language")
			.on("headless_translations")
			.columns(["translation_key_id", "language_id"])
			.execute();
	},
	async down(db: Kysely<unknown>) {},
};

export default Migration00000002;
