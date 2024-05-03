import type { BooleanInt } from "../libs/db/types.js";
import type {
	CustomField,
	FieldTypes,
} from "../libs/builders/field-builder/types.js";
import type { CollectionBrickConfigT } from "../libs/builders/collection-builder/index.js";
import type { ErrorResult } from "./errors.js";

export interface UserResponse {
	id: number;
	superAdmin?: BooleanInt;
	email: string;
	username: string;
	firstName: string | null;
	lastName: string | null;

	roles?: UserPermissionsResponse["roles"];
	permissions?: UserPermissionsResponse["permissions"];

	createdAt: string | null;
	updatedAt?: string | null;
}

export interface UserPermissionsResponse {
	roles: Array<{
		id: number;
		name: string;
	}>;
	permissions: Permission[];
}

export interface SettingsResponse {
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
			limit: number;
		};
		processed: {
			stored: boolean;
			imageLimit: number;
			total: number | null;
		};
	};
}

export interface RoleResponse {
	id: number;
	name: string;
	description: string | null;

	permissions?: {
		id: number;
		permission: Permission;
	}[];

	createdAt: string | null;
	updatedAt: string | null;
}

export type OptionName = "media_storage_used";

export interface OptionsResponse {
	name: OptionName;
	valueText: string | null;
	valueInt: number | null;
	valueBool: BooleanInt | null;
}

export type MediaType =
	| "image"
	| "video"
	| "audio"
	| "document"
	| "archive"
	| "unknown";

export interface MediaResponse {
	id: number;
	key: string;
	url: string;
	titleTranslations: {
		languageId: number | null;
		value: string | null;
	}[];
	altTranslations: {
		languageId: number | null;
		value: string | null;
	}[];
	type: MediaType;
	meta: {
		mimeType: string;
		fileExtension: string;
		fileSize: number;
		width: number | null;
		height: number | null;
	};
	createdAt: string | null;
	updatedAt: string | null;
}

export interface LanguageResponse {
	id: number;
	code: string;
	name: string | null;
	nativeName: string | null;
	isDefault: BooleanInt;
	isEnabled: BooleanInt;
	createdAt: string | null;
	updatedAt: string | null;
}

export interface EmailResponse {
	id: number;
	mailDetails: {
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
	deliveryStatus: "sent" | "failed" | "pending";
	type: "external" | "internal";
	emailHash: string;
	sentCount: number;
	errorCount: number;
	html: string | null;
	errorMessage: string | null;

	createdAt: string | null;
	lastSuccessAt: string | null;
	lastAttemptAt: string | null;
}

export interface CollectionResponse {
	key: string;
	mode: "single" | "multiple";
	title: string;
	singular: string;
	description: string | null;
	documentId?: number | null;
	translations: boolean;
	fixedBricks: Array<CollectionBrickConfigT>;
	builderBricks: Array<CollectionBrickConfigT>;
	fields: Array<CustomField>;
}

export interface BrickResponse {
	id: number;
	key: string;
	order: number;
	type: "builder" | "fixed";
	fields: Array<FieldResponse>;
}

export interface FieldResponse {
	key: string;
	type: FieldTypes;
	groupId?: number;
	value?: FieldResponseValue;
	meta?: FieldResponseMeta;
	languageId?: number;
	groups?: Array<FieldGroupResponse>;
}
export interface FieldGroupResponse {
	id: number;
	fields: Array<FieldResponse>;
}

export type FieldResponseValue =
	| string
	| number
	| boolean
	| null
	| undefined
	| Record<string, unknown>
	| LinkValue
	| MediaValue;

export type FieldResponseMeta = null | undefined | MediaMeta | UserMeta;

export interface LinkValue {
	url: string | null;
	target: string | null;
	label: string | null;
}

export type MediaValue = number;

export interface MediaMeta {
	id: number | null;
	url: string | null;
	key: string | null;
	mimeType: string | null;
	fileExtension: string | null;
	fileSize: number | null;
	width: number | null;
	height: number | null;
	titleTranslations?: Array<{
		value: string | null;
		languageId: number | null;
	}>;
	altTranslations?: Array<{
		value: string | null;
		languageId: number | null;
	}>;
	type: MediaType | null;
}

export interface UserMeta {
	username: string | null;
	email: string | null;
	firstName: string | null;
	lastName: string | null;
}

export interface CollectionDocumentResponse {
	id: number;
	collectionKey: string | null;

	createdBy: number | null;
	createdAt: string | null;
	updatedAt: string | null;

	bricks?: Array<BrickResponse> | null;
	fields?: Array<FieldResponse> | null;
}

export interface ResponseBody<D = unknown> {
	data: D;
	links?: {
		first: string | null;
		last: string | null;
		next: string | null;
		prev: string | null;
	};
	meta: {
		links: Array<{
			active: boolean;
			label: string;
			url: string | null;
			page: number;
		}>;
		path: string;

		currentPage: number | null;
		lastPage: number | null;
		perPage: number | null;
		total: number | null;
	};
}

export interface ErrorResponse {
	status: number;
	name: string;
	message: string;
	errors?: ErrorResult;
}

export type Permission =
	| "create_user"
	| "update_user"
	| "delete_user"
	| "create_role"
	| "update_role"
	| "delete_role"
	| "create_media"
	| "update_media"
	| "delete_media"
	| "update_settings"
	| "read_email"
	| "delete_email"
	| "send_email"
	| "create_language"
	| "update_language"
	| "delete_language"
	| "create_content"
	| "update_content"
	| "delete_content"
	| "delete_collection"
	| "create_collection"
	| "update_collection";

export type PermissionGroup = {
	key: string;
	permissions: Permission[];
};

export type PermissionGroupKey =
	| "users"
	| "roles"
	| "media"
	| "settings"
	| "languages"
	| "emails"
	| "content";
