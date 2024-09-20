import type { Kysely } from "kysely";
import type { Migration, Generated, ColumnType } from "kysely";
import type { FieldTypes } from "../custom-fields/types.js";
import type { OptionName } from "../../types/response.js";
import type { BrickTypes } from "../builders/brick-builder/types.js";

export type KyselyDB = Kysely<LucidDB>;

export enum AdapterType {
	SQLITE = 0,
	POSTGRES = 1,
	LIBSQL = 2,
}

export type MigrationFn = (adapter: AdapterType) => Migration;

export type Select<T> = {
	[P in keyof T]: T[P] extends { __select__: infer S } ? S : T[P];
};

// ------------------------------------------------------------------------------
// Column types

export type TimestampMutateable = ColumnType<
	string | Date | null,
	string | undefined,
	string
>;
export type TimestampImmutable = ColumnType<
	string | Date,
	string | undefined,
	never
>;
export type BooleanInt = 0 | 1;
export type JSONString = string;

// ------------------------------------------------------------------------------
// Tables

export interface HeadlessLocales {
	code: string;
	created_at: TimestampImmutable;
	updated_at: TimestampMutateable;
	is_deleted: ColumnType<BooleanInt, BooleanInt | undefined, BooleanInt>;
	is_deleted_at: TimestampMutateable;
}

export interface HeadlessTranslationKeys {
	id: Generated<number>;
	created_at: TimestampImmutable;
}

export interface HeadlessTranslations {
	id: Generated<number>;
	translation_key_id: number;
	locale_code: string;
	value: string | null;
}

export interface HeadlessOptions {
	name: OptionName;
	value_int: number | null;
	value_text: string | null;
	value_bool: BooleanInt | null;
}

export interface HeadlessUsers {
	id: Generated<number>;
	super_admin: ColumnType<BooleanInt, BooleanInt | undefined, BooleanInt>;
	email: string;
	username: string;
	first_name: string | null;
	last_name: string | null;
	password: ColumnType<string, string | undefined, string>;
	secret: ColumnType<string, string, string>;
	triggered_password_reset: ColumnType<
		BooleanInt,
		BooleanInt | undefined,
		BooleanInt
	>;
	is_deleted: BooleanInt | null;
	is_deleted_at: TimestampMutateable;
	deleted_by: number | null;
	created_at: TimestampImmutable;
	updated_at: TimestampMutateable;
}

export interface HeadlessRoles {
	id: Generated<number>;
	name: string;
	description: string | null;
	created_at: TimestampImmutable;
	updated_at: TimestampMutateable;
}

export interface HeadlessRolePermissions {
	id: Generated<number>;
	role_id: number;
	permission: string;
	created_at: TimestampImmutable;
	updated_at: TimestampMutateable;
}

export interface HeadlessUserRoles {
	id: Generated<number>;
	user_id: number | null;
	role_id: number | null;
	created_at: TimestampImmutable;
	updated_at: TimestampMutateable;
}

export interface HeadlessUserTokens {
	id: Generated<number>;
	user_id: number | null;
	token_type: "password_reset" | "refresh";
	token: string;
	created_at: TimestampImmutable;
	expiry_date: TimestampMutateable;
}

export interface HeadlessEmails {
	id: Generated<number>;
	email_hash: string;
	from_address: string;
	from_name: string;
	to_address: string;
	subject: string;
	cc: string | null;
	bcc: string | null;
	delivery_status: "pending" | "delivered" | "failed";
	template: string;
	data: JSONString | null;
	type: "internal" | "external";
	sent_count: number;
	error_count: number;
	last_error_message: string | null;
	last_attempt_at: TimestampMutateable;
	last_success_at: TimestampMutateable;
	created_at: TimestampImmutable;
}

export interface HeadlessMedia {
	id: Generated<number>;
	key: string;
	e_tag: string | null;
	visible: BooleanInt;
	type: string;
	mime_type: string;
	file_extension: string;
	file_size: number;
	width: number | null;
	height: number | null;
	blur_hash: string | null;
	average_colour: string | null;
	is_dark: BooleanInt | null;
	is_light: BooleanInt | null;
	custom_meta: string | null;
	title_translation_key_id: number | null;
	alt_translation_key_id: number | null;
	created_at: TimestampImmutable;
	updated_at: TimestampMutateable;
}

export interface HeadlessMediaAwaitingSync {
	key: string;
	timestamp: TimestampImmutable;
}

export interface HeadlessProcessedImages {
	key: string;
	media_key: string | null;
	file_size: number;
}

export interface HeadlessCollectionDocuments {
	id: Generated<number>;
	collection_key: string;
	is_deleted: ColumnType<BooleanInt, BooleanInt | undefined, BooleanInt>;
	is_deleted_at: TimestampMutateable;
	deleted_by: number | null;
	created_by: number | null;
	updated_by: number | null;
	created_at: TimestampImmutable;
	updated_at: TimestampMutateable;
}

export interface HeadlessCollectionDocumentBricks {
	id: Generated<number>;
	collection_document_id: number;
	brick_type: BrickTypes;
	brick_key: string | null;
	brick_order: number | null;
	brick_open: BooleanInt | null;
}

export interface HeadlessCollectionDocumentGroups {
	group_id: Generated<number>;
	collection_document_id: number;
	collection_brick_id: number;
	parent_group_id: number | null;
	repeater_key: string;
	group_order: number;
	group_open: BooleanInt | null;
	ref: string | null;
}

export interface HeadlessCollectionDocumentFields {
	fields_id: Generated<number>;
	collection_document_id: number;
	collection_brick_id: number;
	group_id: number | null;
	locale_code: string;
	key: string;
	type: FieldTypes;
	text_value: string | null;
	int_value: number | null;
	bool_value: BooleanInt | null;
	json_value: JSONString | null;
	user_id: number | null;
	media_id: number | null;
	document_id: number | null;
}

export interface HeadlessClientIntegrations {
	id: Generated<number>;
	name: string;
	description: string | null;
	enabled: BooleanInt;
	key: string;
	api_key: string;
	secret: string;
	created_at: TimestampImmutable;
	updated_at: TimestampMutateable;
}

// ------------------------------------------------------------------------------
// Database

export interface LucidDB {
	lucid_locales: HeadlessLocales;
	lucid_translation_keys: HeadlessTranslationKeys;
	lucid_translations: HeadlessTranslations;
	lucid_options: HeadlessOptions;
	lucid_users: HeadlessUsers;
	lucid_roles: HeadlessRoles;
	lucid_role_permissions: HeadlessRolePermissions;
	lucid_user_roles: HeadlessUserRoles;
	lucid_user_tokens: HeadlessUserTokens;
	lucid_emails: HeadlessEmails;
	lucid_media: HeadlessMedia;
	lucid_media_awaiting_sync: HeadlessMediaAwaitingSync;
	lucid_processed_images: HeadlessProcessedImages;
	lucid_collection_documents: HeadlessCollectionDocuments;
	lucid_collection_document_bricks: HeadlessCollectionDocumentBricks;
	lucid_collection_document_groups: HeadlessCollectionDocumentGroups;
	lucid_collection_document_fields: HeadlessCollectionDocumentFields;
	lucid_client_integrations: HeadlessClientIntegrations;
}
