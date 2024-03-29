export interface LanguageResT {
	id: number;
	code: string;
	name: string | null;
	native_name: string | null;
	is_default: 1 | 0;
	is_enabled: 1 | 0;
	created_at: string | null;
	updated_at: string | null;
}
