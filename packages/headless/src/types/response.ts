import type { PermissionT } from "../services/permissions.js";
import type { BooleanInt } from "../libs/db/types.js";
import type {
	CustomFieldT,
	FieldTypesT,
} from "../libs/builders/field-builder/types.js";
import type { CollectionBrickConfigT } from "../libs/builders/collection-builder/index.js";

export interface UserResT {
	id: number;
	superAdmin?: BooleanInt;
	email: string;
	username: string;
	firstName: string | null;
	lastName: string | null;

	roles?: UserPermissionsResT["roles"];
	permissions?: UserPermissionsResT["permissions"];

	createdAt: string | null;
	updatedAt?: string | null;
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
			imageLimit: number;
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

	createdAt: string | null;
	updatedAt: string | null;
}

export type OptionNameT = "media_storage_used";

export interface OptionsResT {
	name: OptionNameT;
	valueText: string | null;
	valueInt: number | null;
	valueBool: BooleanInt | null;
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
	titleTranslations: {
		languageId: number | null;
		value: string | null;
	}[];
	altTranslations: {
		languageId: number | null;
		value: string | null;
	}[];
	type: MediaTypeT;
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

export interface LanguageResT {
	id: number;
	code: string;
	name: string | null;
	nativeName: string | null;
	isDefault: BooleanInt;
	isEnabled: BooleanInt;
	createdAt: string | null;
	updatedAt: string | null;
}

export interface EmailResT {
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

export interface CollectionResT {
	key: string;
	mode: "single" | "multiple";
	title: string;
	singular: string;
	description: string | null;
	documentId?: number | null;
	translations: boolean;
	fixedBricks: Array<CollectionBrickConfigT>;
	builderBricks: Array<CollectionBrickConfigT>;
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
	fieldsId: number;
	key: string;
	type: FieldTypesT;
	groupId?: number | null;
	value?: FieldResValueT;
	meta?: FieldResMetaT;
	languageId: number;
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
	titleTranslations?: Array<{
		value: string | null;
		languageId: number | null;
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
	mimeType?: string;
	fileExtension?: string;
	fileSize?: number;
	width?: number;
	height?: number;
	titleTranslations?: Array<{
		value: string | null;
		languageId: number | null;
	}>;
	altTranslations?: Array<{
		value: string | null;
		languageId: number | null;
	}>;
	type?: MediaTypeT;
}

export interface GroupResT {
	groupId: number;
	groupOrder: number;
	parentGroupId: number | null;
	repeaterKey: string;
	languageId: number;
}

export interface CollectionDocumentResT {
	id: number;
	collectionKey: string | null;

	createdBy: number | null;
	createdAt: string | null;
	updatedAt: string | null;

	author: {
		id: number | null;
		email: string | null;
		firstName: string | null;
		lastName: string | null;
		username: string | null;
	} | null;

	bricks?: Array<BrickResT> | null;
	fields?: Array<FieldResT> | null;
}
