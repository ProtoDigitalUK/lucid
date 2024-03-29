import { PermissionT, EnvironmentPermissionT } from "./permissions.d.ts";

// User
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

export interface UserRoleResT {
	id: number;
	name: string;
}

export interface UserPermissionsResT {
	roles: UserRoleResT[];
	permissions: PermissionT[];
}
