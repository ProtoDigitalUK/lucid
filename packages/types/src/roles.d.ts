export interface RoleResT {
	id: number;
	name: string;

	permissions?: {
		id: RolePermissionT["id"];
		permission: RolePermissionT["permission"];
		environment_key: RolePermissionT["environment_key"];
	}[];

	created_at: string | null;
	updated_at: string | null;
}
