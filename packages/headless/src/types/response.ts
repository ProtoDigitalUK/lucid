import type { PermissionT } from "../services/permissions.js";
import type { BooleanInt } from "../libs/db/types.js";
import type { Config } from "./config.js";
import type {
	CustomFieldT,
	FieldTypesT,
} from "../libs/builders/field-builder/types.js";
import type { CollectionBrickConfigT } from "../libs/builders/collection-builder/index.js";

export interface UserResT {
	id: number;
	super_admin?: BooleanInt;
	email: string;
	username: string;
	first_name: string | null;
	last_name: string | null;

	roles?: UserPermissionsResT["roles"];
	permissions?: UserPermissionsResT["permissions"];

	created_at: string | null;
	updated_at?: string | null;
}

export interface UserPermissionsResT {
	roles: Array<{
		id: number;
		name: string;
	}>;
	permissions: PermissionT[];
}

export interface SettingsResT {
	email: {
		enabled: boolean;
		from: {
			email: string;
			name: string;
		} | null;
	};
	media: {
		enabled: boolean;
		storage: {
			total: number;
			remaining: number | null;
			used: number | null;
		};
		processed: {
			stored: boolean;
			image_limit: number;
			total: number | null;
		};
	};
}

export interface RoleResT {
	id: number;
	name: string;
	description: string | null;

	permissions?: {
		id: number;
		permission: PermissionT;
	}[];

	created_at: string | null;
	updated_at: string | null;
}

export type OptionNameT = "media_storage_used";

export interface OptionsResT {
	name: OptionNameT;
	value_text: string | null;
	value_int: number | null;
	value_bool: BooleanInt | null;
}

export type MediaTypeT =
	| "image"
	| "video"
	| "audio"
	| "document"
	| "archive"
	| "unknown";

export interface MediaResT {
	id: number;
	key: string;
	url: string;
	title_translations: {
		language_id: number | null;
		value: string | null;
	}[];
	alt_translations: {
		language_id: number | null;
		value: string | null;
	}[];
	type: MediaTypeT;
	meta: {
		mime_type: string;
		file_extension: string;
		file_size: number;
		width: number | null;
		height: number | null;
	};
	created_at: string | null;
	updated_at: string | null;
}

export interface LanguageResT {
	id: number;
	code: string;
	name: string | null;
	native_name: string | null;
	is_default: BooleanInt;
	is_enabled: BooleanInt;
	created_at: string | null;
	updated_at: string | null;
}

export interface EmailResT {
	id: number;
	mail_details: {
		from: {
			address: string;
			name: string;
		};
		to: string;
		subject: string;
		cc: null | string;
		bcc: null | string;
		template: string;
	};
	data: Record<string, unknown> | null;
	delivery_status: "sent" | "failed" | "pending";
	type: "external" | "internal";
	email_hash: string;
	sent_count: number;
	error_count: number;
	html: string | null;
	error_message: string | null;

	created_at: string | null;
	last_success_at: string | null;
	last_attempt_at: string | null;
}

export interface CollectionResT {
	key: string;
	mode: "single" | "multiple";
	title: string;
	singular: string;
	description: string | null;
	document_id?: number | null;
	translations: boolean;
	fixed_bricks: Array<CollectionBrickConfigT>;
	builder_bricks: Array<CollectionBrickConfigT>;
	fields: Array<CustomFieldT>;
}

export interface BrickResT {
	id: number;
	key: string;
	order: number;
	type: "builder" | "fixed";
	groups: Array<GroupResT>;
	fields: Array<FieldResT>;
}

export interface FieldResT {
	fields_id: number;
	key: string;
	type: FieldTypesT;
	group_id?: number | null;
	value?: FieldResValueT;
	meta?: FieldResMetaT;
	language_id: number;
}

export type FieldResValueT =
	| string
	| number
	| boolean
	| null
	| undefined
	| Record<string, unknown>
	| LinkValueT
	| MediaValueT
	| PageLinkValueT;

export type FieldResMetaT = null | undefined | MediaMetaT | PageLinkMetaT;

export interface PageLinkValueT {
	id: number | null;
	target?: string | null;
	label?: string | null;
}

export interface PageLinkMetaT {
	title_translations?: Array<{
		value: string | null;
		language_id: number | null;
	}>;
}

export interface LinkValueT {
	url: string | null;
	target?: string | null;
	label?: string | null;
}

export type MediaValueT = number;

export interface MediaMetaT {
	id?: number;
	url?: string;
	key?: string;
	mime_type?: string;
	file_extension?: string;
	file_size?: number;
	width?: number;
	height?: number;
	title_translations?: Array<{
		value: string | null;
		language_id: number | null;
	}>;
	alt_translations?: Array<{
		value: string | null;
		language_id: number | null;
	}>;
	type?: MediaTypeT;
}

export interface GroupResT {
	group_id: number;
	group_order: number;
	parent_group_id: number | null;
	repeater_key: string;
	language_id: number;
}

export interface CollectionDocumentResT {
	id: number;
	collection_key: string | null;

	created_by: number | null;
	created_at: string | null;
	updated_at: string | null;

	author: {
		id: number | null;
		email: string | null;
		first_name: string | null;
		last_name: string | null;
		username: string | null;
	} | null;

	bricks?: Array<BrickResT> | null;
	fields?: Array<FieldResT> | null;
}
