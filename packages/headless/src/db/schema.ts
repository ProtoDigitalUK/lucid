import {
	pgTable,
	serial,
	text,
	boolean,
	pgEnum,
	integer,
	unique,
} from "drizzle-orm/pg-core";
import { type InferSelectModel, sql } from "drizzle-orm";

// --------------------------------------------------------- //
// Environments

export const environments = pgTable("headless_environments", {
	key: text("key").primaryKey(),

	title: text("title").notNull(),
});

export const assignedBricks = pgTable("headless_assigned_bricks", {
	key: text("key").primaryKey(),
	environment_key: text("environment_key")
		.references(() => environments.key, { onDelete: "cascade" })
		.notNull(),
});

export const assignedCollections = pgTable("headless_assigned_collections", {
	key: text("key").primaryKey(),
	environment_key: text("environment_key")
		.references(() => environments.key, { onDelete: "cascade" })
		.notNull(),
});

// --------------------------------------------------------- //
// Languages

export const headlessLanguages = pgTable("headless_languages", {
	id: integer("id").primaryKey(),
	code: text("code").notNull().unique(), // ISO 639-1 - bcp47
	is_default: boolean("is_default").notNull().default(false),
	is_enabled: boolean("is_enabled").notNull().default(true),

	created_at: text("created_at").default(sql`NOW()`),
	updated_at: text("updated_at").default(sql`NOW()`),
});

export const headlessTranslationKeys = pgTable("headless_translation_keys", {
	id: integer("id").primaryKey(),
});

export const headlessTranslations = pgTable(
	"headless_translations",
	{
		id: integer("id").primaryKey(),
		translation_key_id: integer("translation_key_id")
			.references(() => headlessTranslationKeys.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			})
			.notNull(),
		language_id: integer("language_id")
			.references(() => headlessLanguages.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			})
			.notNull(),
		value: text("value"),

		created_at: text("created_at").default(sql`NOW()`),
		updated_at: text("updated_at").default(sql`NOW()`),
	},
	(t) => ({
		unq: unique().on(t.translation_key_id, t.language_id),
	}),
);

// --------------------------------------------------------- //
// Users & Permissions

export const users = pgTable("headless_users", {
	id: serial("id").primaryKey(),

	super_admin: boolean("super_admin").default(false),
	email: text("email").unique().notNull(),
	username: text("username").unique().notNull(),
	first_name: text("first_name"),
	last_name: text("last_name"),
	password: text("password").notNull(),

	delete: boolean("delete").default(false),
	deleted_at: text("deleted_at"),

	created_at: text("created_at").default(sql`NOW()`),
	updated_at: text("updated_at").default(sql`NOW()`),
});

export type UsersT = InferSelectModel<typeof users>;

export const roles = pgTable("headless_roles", {
	id: serial("id").primaryKey(),
	name: text("name").unique().notNull(),
	description: text("description"),

	created_at: text("created_at").default(sql`NOW()`),
	updated_at: text("updated_at").default(sql`NOW()`),
});

export const rolePermissions = pgTable("headless_role_permissions", {
	id: serial("id").primaryKey(),
	role_id: serial("role_id")
		.references(() => roles.id, { onDelete: "cascade" })
		.notNull(),
	permission: text("permission").notNull(),
	environment_key: text("environment_key")
		.references(() => environments.key, { onDelete: "cascade" })
		.notNull(),

	created_at: text("created_at").default(sql`NOW()`),
	updated_at: text("updated_at").default(sql`NOW()`),
});

export type RolePermissionsT = InferSelectModel<typeof rolePermissions>;

export const userRoles = pgTable("headless_user_roles", {
	id: serial("id").primaryKey(),
	user_id: serial("user_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	role_id: serial("role_id")
		.references(() => roles.id, { onDelete: "cascade" })
		.notNull(),

	created_at: text("created_at").default(sql`NOW()`),
	updated_at: text("updated_at").default(sql`NOW()`),
});

export type UserRolesT = InferSelectModel<typeof userRoles>;

export const tokenTypeEnum = pgEnum("type", ["password_reset", "refresh"]);

export const userTokens = pgTable("headless_user_tokens", {
	id: serial("id").primaryKey(),
	user_id: serial("user_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	token: text("token").notNull(),
	type: tokenTypeEnum("type").notNull(),

	created_at: text("created_at").default(sql`NOW()`),
	expires_at: text("expires_at").notNull(),
});
