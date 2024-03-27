import { type Migration } from "kysely";

export enum AdapterType {
	SQLITE = 0,
	POSTGRES = 1,
	LIBSQL = 2,
}

export type MigrationFn = (adapter: AdapterType) => Migration;

export interface Test {
	hi: string;
}
