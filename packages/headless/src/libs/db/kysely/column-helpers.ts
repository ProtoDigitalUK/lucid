import { ColumnDefinitionBuilder, sql } from "kysely";
import { AdapterType } from "../db.js";

export const defaultTimestamp = (
	col: ColumnDefinitionBuilder,
	adapter: AdapterType,
) => {
	if (adapter === AdapterType.POSTGRES) {
		return col.defaultTo(sql`NOW()`);
	}

	return col.defaultTo("CURRENT_TIMESTAMP");
};

export const primaryKeyColumnType = (adapter: AdapterType) => {
	if (adapter === AdapterType.POSTGRES) {
		return "serial";
	}

	return "integer";
};

export const primaryKeyColumn = (
	col: ColumnDefinitionBuilder,
	adapter: AdapterType,
) => {
	if (adapter === AdapterType.POSTGRES) {
		col.primaryKey();
	}

	return col.primaryKey().autoIncrement();
};
