import { Kysely, sql, Migration } from "kysely";

const Migration00000005: Migration = {
	async up(db: Kysely<unknown>) {
		await db.schema
			.createTable("headless_emails")
			.addColumn("id", "serial", (col) => col.primaryKey())
			.addColumn("email_hash", "char(64)", (col) =>
				col.unique().notNull(),
			)
			.addColumn("from_address", "text", (col) => col.notNull())
			.addColumn("from_name", "text", (col) => col.notNull())
			.addColumn("to_address", "text", (col) => col.notNull())
			.addColumn("subject", "text", (col) => col.notNull())
			.addColumn("cc", "text")
			.addColumn("bcc", "text")
			.addColumn("delivery_status", "text", (col) => col.notNull()) // 'pending', 'delivered', 'failed'
			.addColumn("template", "text", (col) => col.notNull())
			.addColumn("data", "jsonb")
			.addColumn("type", "text", (col) => col.notNull()) // 'internal' or 'external'
			.addColumn("sent_count", "integer", (col) =>
				col.notNull().defaultTo(0),
			)
			.addColumn("error_count", "integer", (col) =>
				col.notNull().defaultTo(0),
			)
			.addColumn("last_error_message", "text")
			.addColumn("last_attempt_at", "timestamp", (col) =>
				col.defaultTo(sql`NOW()`),
			)
			.addColumn("last_success_at", "timestamp")
			.addColumn("created_at", "timestamp", (col) =>
				col.defaultTo(sql`NOW()`),
			)
			.execute();
	},
	async down(db: Kysely<unknown>) {},
};

export default Migration00000005;
