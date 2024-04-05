import type { PermissionT } from "../services/permissions.ts";
import type { BooleanInt } from "../libs/db/types.ts";

export interface UserResT {
	id: number;
	super_admin?: 1 | 0;
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
	media: {
		storage_used: number | null;
		storage_limit: number | null;
		storage_remaining: number | null;
		processed_images: {
			stored: boolean | null;
			per_image_limit: number | null;
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
