import { type ColumnDefinitionBuilder } from "kysely";
import { AdapterType } from "../types.js";

import SqlLiteAdapter from "../adapters/sqllite/index.js";
import PostgresAdapter from "../adapters/postgres/index.js";
import LibsqlAdapter from "../adapters/libsql/index.js";

export const defaultTimestamp = (
	col: ColumnDefinitionBuilder,
	adapter: AdapterType,
) => {
	switch (adapter) {
		case AdapterType.SQLITE:
			return col.defaultTo(SqlLiteAdapter.defaultTimestamp());
		case AdapterType.POSTGRES:
			return col.defaultTo(PostgresAdapter.defaultTimestamp());
		case AdapterType.LIBSQL:
			return col.defaultTo(LibsqlAdapter.defaultTimestamp());
	}
};

export const primaryKeyColumnType = (adapter: AdapterType) => {
	switch (adapter) {
		case AdapterType.SQLITE:
			return SqlLiteAdapter.primaryKeyColumnType();
		case AdapterType.POSTGRES:
			return PostgresAdapter.primaryKeyColumnType();
		case AdapterType.LIBSQL:
			return LibsqlAdapter.primaryKeyColumnType();
	}
};

export const primaryKeyColumn = (
	col: ColumnDefinitionBuilder,
	adapter: AdapterType,
) => {
	switch (adapter) {
		case AdapterType.SQLITE:
			return col.primaryKey().autoIncrement();
		case AdapterType.POSTGRES:
			return col.primaryKey();
		case AdapterType.LIBSQL:
			return col.primaryKey().autoIncrement();
	}
};
