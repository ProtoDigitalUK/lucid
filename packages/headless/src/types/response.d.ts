import { type PermissionT } from "../services/permissions.ts";

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
