import { Kysely, sql, Migration } from "kysely";

const Migration00000004: Migration = {
	async up(db: Kysely<unknown>) {
		await db.schema
			.createTable("headless_users")
			.addColumn("id", "integer", (col) =>
				col.primaryKey().autoIncrement(),
			)
			.addColumn("super_admin", "boolean", (col) => col.defaultTo(false))
			.addColumn("email", "text", (col) => col.notNull().unique())
			.addColumn("username", "text", (col) => col.notNull().unique())
			.addColumn("first_name", "text")
			.addColumn("last_name", "text")
			.addColumn("password", "text", (col) => col.notNull())
			.addColumn("is_deleted", "boolean", (col) => col.defaultTo(false))
			.addColumn("is_deleted_at", "timestamp")
			.addColumn("deleted_by", "integer", (col) =>
				col.references("headless_users.id").onDelete("set null"),
			)
			.addColumn("created_at", "timestamp", (col) =>
				col.defaultTo(sql`CURRENT_TIMESTAMP`),
			)
			.addColumn("updated_at", "timestamp", (col) =>
				col.defaultTo(sql`CURRENT_TIMESTAMP`),
			)
			.execute();

		await db.schema
			.createTable("headless_roles")
			.addColumn("id", "integer", (col) =>
				col.primaryKey().autoIncrement(),
			)
			.addColumn("name", "text", (col) => col.notNull().unique())
			.addColumn("description", "text")
			.addColumn("created_at", "timestamp", (col) =>
				col.defaultTo(sql`CURRENT_TIMESTAMP`),
			)
			.addColumn("updated_at", "timestamp", (col) =>
				col.defaultTo(sql`CURRENT_TIMESTAMP`),
			)
			.execute();

		await db.schema
			.createTable("headless_role_permissions")
			.addColumn("id", "integer", (col) =>
				col.primaryKey().autoIncrement(),
			)
			.addColumn("role_id", "integer", (col) =>
				col.references("headless_roles.id").onDelete("cascade"),
			)
			.addColumn("permission", "text", (col) => col.notNull())
			.addColumn("created_at", "timestamp", (col) =>
				col.defaultTo(sql`CURRENT_TIMESTAMP`),
			)
			.addColumn("updated_at", "timestamp", (col) =>
				col.defaultTo(sql`CURRENT_TIMESTAMP`),
			)
			.execute();

		await db.schema
			.createTable("headless_user_roles")
			.addColumn("id", "integer", (col) =>
				col.primaryKey().autoIncrement(),
			)
			.addColumn("user_id", "integer", (col) =>
				col.references("headless_users.id").onDelete("cascade"),
			)
			.addColumn("role_id", "integer", (col) =>
				col.references("headless_roles.id").onDelete("cascade"),
			)
			.addColumn("created_at", "timestamp", (col) =>
				col.defaultTo(sql`CURRENT_TIMESTAMP`),
			)
			.addColumn("updated_at", "timestamp", (col) =>
				col.defaultTo(sql`CURRENT_TIMESTAMP`),
			)
			.execute();

		await db.schema
			.createTable("headless_user_tokens")
			.addColumn("id", "integer", (col) =>
				col.primaryKey().autoIncrement(),
			)
			.addColumn("user_id", "integer", (col) =>
				col.references("headless_users.id").onDelete("cascade"),
			)
			.addColumn("token_type", "varchar(255)")
			.addColumn("token", "varchar(255)", (col) => col.notNull().unique())
			.addColumn("created_at", "timestamp", (col) =>
				col.defaultTo(sql`CURRENT_TIMESTAMP`),
			)
			.addColumn("expiry_date", "timestamp", (col) => col.notNull())
			.execute();
	},
	async down(db: Kysely<unknown>) {},
};

export default Migration00000004;
