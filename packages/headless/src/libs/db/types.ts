import type { Migration, Generated, ColumnType } from "kysely";
import type { FieldTypesT } from "../field-builder/types.js";

// ------------------------------------------------------------------------------
// Migration / Adapters

export enum AdapterType {
	SQLITE = 0,
	POSTGRES = 1,
	LIBSQL = 2,
}

export type MigrationFn = (adapter: AdapterType) => Migration;

// ------------------------------------------------------------------------------
// Column types

export type TimestampMutateable = ColumnType<
	Date | string,
	string | undefined,
	string
>;
export type TimestampImmutable = ColumnType<
	Date | string,
	string | undefined,
	never
>;
export type BooleanInt = 0 | 1;
export type JSONString = string;

// ------------------------------------------------------------------------------
// Tables

export interface HeadlessLanguages {
	id: Generated<number>;
	code: string;
	is_default: BooleanInt;
	is_enabled: BooleanInt;
	created_at: TimestampImmutable;
	updated_at: TimestampMutateable | null;
}

export interface HeadlessTranslationKeys {
	id: Generated<number>;
	created_at: TimestampImmutable;
}

export interface HeadlessTranslations {
	id: Generated<number>;
	translation_key_id: number;
	language_id: number;
	value: string | null;
}

export interface HeadlessOptions {
	name: string;
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
	password: string;
	is_deleted: BooleanInt | null;
	is_deleted_at: TimestampMutateable | null;
	deleted_by: number | null;
	created_at: TimestampImmutable;
	updated_at: TimestampMutateable | null;
}

export interface HeadlessRoles {
	id: Generated<number>;
	name: string;
	description: string | null;
	created_at: TimestampImmutable;
	updated_at: TimestampMutateable | null;
}

export interface HeadlessRolePermissions {
	id: Generated<number>;
	role_id: number;
	permission: string;
	created_at: TimestampImmutable;
	updated_at: TimestampMutateable | null;
}

export interface HeadlessUserRoles {
	id: Generated<number>;
	user_id: number | null;
	role_id: number | null;
	created_at: TimestampImmutable;
	updated_at: TimestampMutateable | null;
}

export interface HeadlessUserTokens {
	id: Generated<number>;
	user_id: number | null;
	token_type: string;
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
	last_attempt_at: TimestampMutateable | null;
	last_success_at: TimestampMutateable | null;
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
	title_translation_key_id: number | null;
	alt_translation_key_id: number | null;
	created_at: TimestampImmutable;
	updated_at: TimestampMutateable | null;
}

export interface HeadlessProcessedImages {
	key: string;
	media_key: string | null;
}

export interface HeadlessCollectionDocuments {
	id: Generated<number>;
	collection_key: string;
	parent_id: number | null;
	slug: string | null;
	full_slug: string | null;
	homepage: ColumnType<BooleanInt, BooleanInt | undefined, BooleanInt>;
	is_deleted: ColumnType<BooleanInt, BooleanInt | undefined, BooleanInt>;
	is_deleted_at: TimestampMutateable | null;
	author_id: number | null;
	deleted_by: number | null;
	created_by: number | null;
	updated_by: number | null;
	created_at: TimestampImmutable;
	updated_at: TimestampMutateable | null;
}

export interface HeadlessCollectionDocumentBricks {
	id: Generated<number>;
	collection_document_id: number;
	brick_type: "builder" | "fixed" | "collection-fields";
	brick_key: string | null;
	brick_order: number | null;
}

export interface HeadlessCollectionDocumentGroups {
	group_id: Generated<number>;
	collection_document_id: number;
	collection_brick_id: number;
	parent_group_id: number | null;
	language_id: number;
	repeater_key: string;
	group_order: number;
	ref: string | null;
}

export interface HeadlessCollectionDocumentFields {
	fields_id: Generated<number>;
	collection_document_id: number;
	collection_brick_id: number;
	group_id: number | null;
	language_id: number;
	key: string;
	type: FieldTypesT;
	text_value: string | null;
	int_value: number | null;
	bool_value: BooleanInt | null;
	json_value: JSONString | null;
	page_link_id: number | null;
	media_id: number | null;
}

export interface HeadlessCollectionCategories {
	id: Generated<number>;
	collection_key: string;
	title_translation_key_id: number | null;
	description_translation_key_id: number | null;
	slug: string;
	created_at: TimestampImmutable;
	updated_at: TimestampMutateable | null;
}

export interface HeadlessCollectionDocumentCategories {
	collection_document_id: number;
	category_id: number;
}

// ------------------------------------------------------------------------------
// Database

export interface HeadlessDB {
	headless_languages: HeadlessLanguages;
	headless_translation_keys: HeadlessTranslationKeys;
	headless_translations: HeadlessTranslations;
	headless_options: HeadlessOptions;
	headless_users: HeadlessUsers;
	headless_roles: HeadlessRoles;
	headless_role_permissions: HeadlessRolePermissions;
	headless_user_roles: HeadlessUserRoles;
	headless_user_tokens: HeadlessUserTokens;
	headless_emails: HeadlessEmails;
	headless_media: HeadlessMedia;
	headless_processed_images: HeadlessProcessedImages;
	headless_collection_documents: HeadlessCollectionDocuments;
	headless_collection_document_bricks: HeadlessCollectionDocumentBricks;
	headless_collection_document_groups: HeadlessCollectionDocumentGroups;
	headless_collection_document_fields: HeadlessCollectionDocumentFields;
	headless_collection_categories: HeadlessCollectionCategories;
	headless_collection_document_categories: HeadlessCollectionDocumentCategories;
}
