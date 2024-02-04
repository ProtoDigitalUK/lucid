import { PermissionT, EnvironmentPermissionT } from "./permissions.d.ts";

// User
export interface UserResT {
	id: number;
	super_admin?: boolean;
	email: string;
	username: string;
	first_name: string | null;
	last_name: string | null;

	roles?: UserPermissionsResT["roles"];
	permissions?: UserPermissionsResT["permissions"];

	created_at: string | null;
	updated_at?: string | null;
}

// User Permissions
export interface UserRoleResT {
	id: number;
	name: string;
}
export interface UserEnvrionmentResT {
	key: string;
	permissions: Array<EnvironmentPermissionT>;
}

export interface UserPermissionsResT {
	roles: UserRoleResT[];
	permissions: {
		global: PermissionT[];
		environments: UserEnvrionmentResT[];
	};
}
