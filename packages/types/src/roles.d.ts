export interface RoleResT {
	id: number;
	name: string;
	description: string | null;

	permissions?: {
		id: number;
		permission: string;
	}[];

	created_at: string | null;
	updated_at: string | null;
}
