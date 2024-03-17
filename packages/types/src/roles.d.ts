export interface RoleResT {
	id: number;
	name: string;
	description: string | null;

	permissions?: {
		id: RolePermissionT["id"];
		permission: RolePermissionT["permission"];
	}[];

	created_at: string | null;
	updated_at: string | null;
}
