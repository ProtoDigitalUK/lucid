import { Kysely, sql, Migration } from "kysely";

const Migration00000007: Migration = {
	async up(db: Kysely<unknown>) {
		// Collection Documents
		await db.schema
			.createTable("headless_collection_documents")
			.addColumn("id", "integer", (col) =>
				col.primaryKey().autoIncrement(),
			)
			.addColumn("collection_key", "text", (col) => col.notNull())
			.addColumn("parent_id", "integer", (col) =>
				col
					.references("headless_collection_documents.id")
					.onDelete("set null"),
			)
			.addColumn("slug", "text")
			.addColumn("full_slug", "text")
			.addColumn("homepage", "boolean", (col) => col.defaultTo(false))
			.addColumn("is_deleted", "boolean", (col) => col.defaultTo(false))
			.addColumn("is_deleted_at", "timestamp")
			.addColumn("author_id", "integer", (col) =>
				col.references("headless_users.id").onDelete("set null"),
			)
			.addColumn("deleted_by", "integer", (col) =>
				col.references("headless_users.id").onDelete("set null"),
			)
			.addColumn("created_by", "integer", (col) =>
				col.references("headless_users.id").onDelete("set null"),
			)
			.addColumn("updated_by", "integer", (col) =>
				col.references("headless_users.id").onDelete("set null"),
			)
			.addColumn("created_at", "timestamp", (col) =>
				col.defaultTo(sql`CURRENT_TIMESTAMP`),
			)
			.addColumn("updated_at", "timestamp", (col) =>
				col.defaultTo(sql`CURRENT_TIMESTAMP`),
			)
			.execute();

		// Bricks
		await db.schema
			.createTable("headless_collection_document_bricks")
			.addColumn("id", "integer", (col) =>
				col.primaryKey().autoIncrement(),
			)
			.addColumn("collection_document_id", "integer", (col) =>
				col
					.references("headless_collection_documents.id")
					.onDelete("cascade")
					.notNull(),
			)
			.addColumn("brick_type", "text", (col) => col.notNull()) // builder, fixed, collection-fields
			.addColumn("brick_key", "text")
			.addColumn("brick_order", "integer")
			.execute();

		// Groups
		await db.schema
			.createTable("headless_collection_document_groups")
			.addColumn("group_id", "integer", (col) =>
				col.primaryKey().autoIncrement(),
			)
			.addColumn("collection_document_id", "integer", (col) =>
				col
					.references("headless_collection_documents.id")
					.onDelete("cascade")
					.notNull(),
			)
			.addColumn("collection_brick_id", "integer", (col) =>
				col
					.references("headless_collection_document_bricks.id")
					.onDelete("cascade")
					.notNull(),
			)
			.addColumn("parent_group_id", "integer", (col) =>
				col
					.references("headless_collection_document_groups.group_id")
					.onDelete("cascade"),
			)
			.addColumn("language_id", "integer", (col) =>
				col
					.references("headless_languages.id")
					.onDelete("cascade")
					.notNull(),
			)
			.addColumn("repeater_key", "text", (col) => col.notNull())
			.addColumn("group_order", "integer", (col) => col.notNull())
			.addColumn("ref", "text")
			.execute();

		await db.schema
			.createIndex("idx_headless_groups_language_id")
			.on("headless_collection_document_groups")
			.column("language_id")
			.execute();

		await db.schema
			.createIndex("idx_headless_groups_collection_brick_id")
			.on("headless_collection_document_groups")
			.column("collection_brick_id")
			.execute();

		await db.schema
			.createIndex("idx_headless_groups_parent_group_id")
			.on("headless_collection_document_groups")
			.column("parent_group_id")
			.execute();

		// Fields
		await db.schema
			.createTable("headless_collection_document_fields")
			.addColumn("fields_id", "integer", (col) =>
				col.primaryKey().autoIncrement(),
			)
			.addColumn("collection_document_id", "integer", (col) =>
				col
					.references("headless_collection_documents.id")
					.onDelete("cascade")
					.notNull(),
			)
			.addColumn("collection_brick_id", "integer", (col) =>
				col
					.references("headless_collection_document_bricks.id")
					.onDelete("cascade")
					.notNull(),
			)
			.addColumn("group_id", "integer", (col) =>
				col
					.references("headless_collection_document_groups.group_id")
					.onDelete("cascade"),
			)
			.addColumn("language_id", "integer", (col) =>
				col
					.references("headless_languages.id")
					.onDelete("cascade")
					.notNull(),
			)
			.addColumn("key", "text", (col) => col.notNull())
			.addColumn("type", "text", (col) => col.notNull())
			.addColumn("text_value", "text")
			.addColumn("int_value", "integer")
			.addColumn("bool_value", "boolean")
			.addColumn("json_value", "jsonb")
			.addColumn("page_link_id", "integer", (col) =>
				col
					.references("headless_collection_documents.id")
					.onDelete("set null"),
			)
			.addColumn("media_id", "integer", (col) =>
				col.references("headless_media.id").onDelete("set null"),
			)
			.execute();

		await db.schema
			.createIndex("idx_headless_fields_language_id")
			.on("headless_collection_document_fields")
			.column("language_id")
			.execute();

		await db.schema
			.createIndex("idx_headless_fields_collection_brick_id")
			.on("headless_collection_document_fields")
			.column("collection_brick_id")
			.execute();

		await db.schema
			.createIndex("idx_headless_fields_group_id")
			.on("headless_collection_document_fields")
			.column("group_id")
			.execute();

		// Categories
		await db.schema
			.createTable("headless_collection_categories")
			.addColumn("id", "integer", (col) =>
				col.primaryKey().autoIncrement(),
			)
			.addColumn("collection_key", "text", (col) => col.notNull())
			.addColumn("title_translation_key_id", "integer", (col) =>
				col
					.references("headless_translation_keys.id")
					.onDelete("set null")
					.onUpdate("cascade"),
			)
			.addColumn("description_translation_key_id", "integer", (col) =>
				col
					.references("headless_translation_keys.id")
					.onDelete("set null")
					.onUpdate("cascade"),
			)
			.addColumn("slug", "text", (col) => col.notNull())
			.addColumn("created_at", "timestamp", (col) =>
				col.defaultTo(sql`CURRENT_TIMESTAMP`),
			)
			.addColumn("updated_at", "timestamp", (col) =>
				col.defaultTo(sql`CURRENT_TIMESTAMP`),
			)
			.addUniqueConstraint(
				"headless_collection_categories_collection_key_slug_unique",
				["collection_key", "slug"],
			)
			.execute();

		await db.schema
			.createTable("headless_collection_document_categories")
			.addColumn("collection_document_id", "integer", (col) =>
				col
					.references("headless_collection_documents.id")
					.onDelete("cascade")
					.notNull(),
			)
			.addColumn("category_id", "integer", (col) =>
				col
					.references("headless_collection_categories.id")
					.onDelete("cascade")
					.notNull(),
			)
			.addPrimaryKeyConstraint("primary_key", [
				"collection_document_id",
				"category_id",
			])
			.addUniqueConstraint(
				"headless_collection_document_categories_collection_document_id_category_id_unique",
				["collection_document_id", "category_id"],
			)
			.execute();
	},
	async down(db: Kysely<unknown>) {},
};

export default Migration00000007;
