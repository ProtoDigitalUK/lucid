import type { RequestQueryParsed } from "../../middleware/validate-query.js";
import type {
	SelectQueryBuilder,
	ReferenceExpression,
	ComparisonOperatorExpression,
	DeleteQueryBuilder,
	OperandValueExpressionOrList,
	UpdateQueryBuilder,
} from "kysely";
import type {
	QueryFilterValue,
	QueryFilterOperator,
} from "../../middleware/validate-query.js";
import type { DocumentFiltersResponse } from "../builders/collection-builder/types.js";
import type { LucidDB } from "./types.js";

export interface QueryBuilderConfigT<DB, Table extends keyof DB> {
	requestQuery: RequestQueryParsed;
	documentFilters?: DocumentFiltersResponse[];
	meta: {
		filters: {
			queryKey: string; // e.g. "filter[status]" - the object key for the specific filter
			tableKey: ReferenceExpression<DB, Table>; // e.g. "status" - the table column name for the specific filter
			operator: ComparisonOperatorExpression | "%";
		}[];
		sorts: {
			queryKey: string;
			tableKey: ReferenceExpression<DB, Table>;
		}[];
		exclude?: {
			queryKey: string;
			tableKey: ReferenceExpression<DB, Table>;
			value: unknown;
			operator: ComparisonOperatorExpression;
		}[];
	};
}

const queryBuilder = <DB, Table extends keyof DB, O, T>(
	query: {
		main: SelectQueryBuilder<DB, Table, O>;
		count?: SelectQueryBuilder<
			DB,
			Table,
			{
				count: unknown;
			}
		>;
	},
	config: {
		queryParams: RequestQueryParsed;
		documentFilters?: DocumentFiltersResponse[];
		meta?: {
			tableKeys?: {
				filters?: Record<string, ReferenceExpression<DB, Table>>;
				sorts?: Record<string, ReferenceExpression<DB, Table>>;
			};
			defaultOperators?: Record<
				string,
				ComparisonOperatorExpression | "%"
			>;
		};
	},
) => {
	let mainQuery = query.main;
	let countQuery = query.count;

	// -----------------------------------------
	// Filters
	const filters = Object.entries(config.queryParams.filter || {});

	for (const [key, f] of filters) {
		const tableKey = getTableKeyMap<DB, Table>(
			key,
			config.meta?.tableKeys?.filters,
		);
		const operator = getFilterOperator(
			key,
			f,
			config.meta?.defaultOperators,
		);

		mainQuery = mainQuery.where(
			tableKey,
			operator as ComparisonOperatorExpression,
			f.value,
		);
		if (countQuery) {
			countQuery = countQuery.where(
				tableKey,
				operator as ComparisonOperatorExpression,
				f.value,
			);
		}
	}

	// Document filters
	if (config.documentFilters && config.documentFilters.length > 0) {
		for (const { key, value, column, operator } of config.documentFilters) {
			const o = getFilterOperator(key, {
				value: value,
				operator: operator,
			});

			mainQuery = mainQuery.where(({ eb, and }) =>
				and([
					// @ts-expect-error
					eb("lucid_collection_document_fields.key", "=", key),
					eb(
						// @ts-expect-error
						`lucid_collection_document_fields.${column}`,
						o,
						value,
					),
				]),
			);
			if (countQuery) {
				countQuery = countQuery.where(({ eb, and }) =>
					and([
						// @ts-expect-error
						eb("lucid_collection_document_fields.key", "=", key),
						eb(
							// @ts-expect-error
							`lucid_collection_document_fields.${column}`,
							o,
							value,
						),
					]),
				);
			}
		}
	}

	// -----------------------------------------
	// Sort
	if (config.queryParams.sort) {
		for (const sort of config.queryParams.sort) {
			const tableKey = getTableKeyMap<DB, Table>(
				sort.key,
				config.meta?.tableKeys?.sorts,
			);
			mainQuery = mainQuery.orderBy(tableKey, sort.value);
		}
	}

	// -----------------------------------------
	// Pagination
	if (config.queryParams.perPage !== -1) {
		mainQuery = mainQuery
			.limit(config.queryParams.perPage)
			.offset((config.queryParams.page - 1) * config.queryParams.perPage);
	}

	return {
		main: mainQuery,
		count: countQuery,
	};
};

const getTableKeyMap = <DB, Table extends keyof DB>(
	key: string,
	keyMap?: Record<string, ReferenceExpression<DB, Table>>,
): ReferenceExpression<DB, Table> => {
	if (keyMap?.[key]) {
		return keyMap[key] || (key as ReferenceExpression<DB, Table>);
	}
	return key as ReferenceExpression<DB, Table>;
};
const getFilterOperator = (
	key: string,
	f: {
		value: QueryFilterValue;
		operator?: QueryFilterOperator;
	},
	operators?: Record<string, ComparisonOperatorExpression | "%">,
) => {
	if (f.operator !== undefined) return f.operator;
	if (Array.isArray(f.value)) return "in";
	return operators?.[key] || "=";
};

export type QueryBuilderWhereT<Table extends keyof LucidDB> = Array<{
	key: ReferenceExpression<LucidDB, Table>;
	operator: ComparisonOperatorExpression;
	value: OperandValueExpressionOrList<LucidDB, Table, keyof Table>;
}>;

export const selectQB = <Table extends keyof LucidDB, O>(
	query: SelectQueryBuilder<LucidDB, Table, O>,
	where: QueryBuilderWhereT<Table>,
) => {
	let kyselyQuery = query;

	for (const { key, operator, value } of where) {
		kyselyQuery = kyselyQuery.where(key, operator, value);
	}

	return kyselyQuery;
};

export const deleteQB = <Table extends keyof LucidDB, O>(
	query: DeleteQueryBuilder<LucidDB, Table, O>,
	where: QueryBuilderWhereT<Table>,
) => {
	let kyselyQuery = query;

	for (const { key, operator, value } of where) {
		kyselyQuery = kyselyQuery.where(key, operator, value);
	}

	return kyselyQuery;
};

export const updateQB = <
	UT extends keyof LucidDB,
	Table extends keyof LucidDB,
	O,
>(
	query: UpdateQueryBuilder<LucidDB, UT, Table, O>,
	where: QueryBuilderWhereT<Table>,
) => {
	let kyselyQuery = query;

	for (const { key, operator, value } of where) {
		kyselyQuery = kyselyQuery.where(key, operator, value);
	}

	return kyselyQuery;
};

export default queryBuilder;
