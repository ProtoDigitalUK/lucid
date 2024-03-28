import { Kysely } from "kysely";
import { MigrationFn } from "../types.js";
import {
	defaultTimestamp,
	primaryKeyColumnType,
	primaryKeyColumn,
} from "../kysely/column-helpers.js";

const Migration00000001: MigrationFn = (adapter) => {
	return {
		async up(db: Kysely<unknown>) {
			await db.schema
				.createTable("headless_languages")
				.addColumn("id", primaryKeyColumnType(adapter), (col) =>
					primaryKeyColumn(col, adapter),
				)
				.addColumn("code", "text", (col) => col.notNull().unique())
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
