import { type RequestQueryParsedT } from "../middleware/validate-query.js";
import {
	type SelectQueryBuilder,
	type ReferenceExpression,
	type ComparisonOperatorExpression,
} from "kysely";

interface QueryBuilderConfigT<DB, Table extends keyof DB> {
	requestQuery: RequestQueryParsedT;
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
	};
}

const queryBuilder = <DB, Table extends keyof DB, O>(
	db: SelectQueryBuilder<DB, Table, O>,
	config: QueryBuilderConfigT<DB, Table>,
) => {
	let query = db;
	const { requestQuery, meta } = config;

	// -----------------------------------------
	// Filters
	const filters = Object.entries(requestQuery.filter || {});
	for (const [queryKey, value] of filters) {
		const filterMeta = meta.filters.find(
			(filter) => filter.queryKey === queryKey,
		);
		if (!filterMeta) continue;

		const { tableKey, operator } = filterMeta;

		const isArray = Array.isArray(value);

		if (isArray) {
			query = query.where(tableKey, "in", value);
		} else {
			query = query.where(
				tableKey,
				operator as ComparisonOperatorExpression, // TODO: needs looking at to add support for the "%" operator
				value,
			);
		}
	}

	// -----------------------------------------
	// Sort
	if (requestQuery.sort) {
		for (const sort of requestQuery.sort) {
			const sortMeta = meta.sorts.find(
				(sortMeta) => sortMeta.queryKey === sort.key,
			);
			if (!sortMeta) continue;

			const { tableKey } = sortMeta;

			query = query.orderBy(tableKey, sort.value);
		}
	}

	// -----------------------------------------
	// Pagination
	query = query
		.limit(requestQuery.per_page)
		.offset((requestQuery.page - 1) * requestQuery.per_page);

	return query;
};

export default queryBuilder;
