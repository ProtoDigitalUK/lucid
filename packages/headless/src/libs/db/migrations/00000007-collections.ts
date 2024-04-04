import type { Kysely } from "kysely";
import type { MigrationFn } from "../types.js";
import {
	defaultTimestamp,
	primaryKeyColumnType,
	primaryKeyColumn,
} from "../kysely/column-helpers.js";

const Migration00000007: MigrationFn = (adapter) => {
	return {
		async up(db: Kysely<unknown>) {
			// Collection Documents
			await db.schema
				.createTable("headless_collection_documents")
				.addColumn("id", primaryKeyColumnType(adapter), (col) =>
					primaryKeyColumn(col, adapter),
				)
				.addColumn("collection_key", "text", (col) => col.notNull())
				.addColumn("is_deleted", "integer", (col) => col.defaultTo(0))
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
					defaultTimestamp(col, adapter),
				)
				.addColumn("updated_at", "timestamp", (col) =>
					defaultTimestamp(col, adapter),
				)
				.execute();

			// Bricks
			await db.schema
				.createTable("headless_collection_document_bricks")
				.addColumn("id", primaryKeyColumnType(adapter), (col) =>
					primaryKeyColumn(col, adapter),
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
				.addColumn("group_id", primaryKeyColumnType(adapter), (col) =>
					primaryKeyColumn(col, adapter),
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
						.references(
							"headless_collection_document_groups.group_id",
						)
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
				.addColumn("fields_id", primaryKeyColumnType(adapter), (col) =>
					primaryKeyColumn(col, adapter),
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
						.references(
							"headless_collection_document_groups.group_id",
						)
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
				.addColumn("bool_value", "integer")
				.addColumn("json_value", "text")
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
		},
		async down(db: Kysely<unknown>) {},
	};
};

export default Migration00000007;
