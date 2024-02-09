import { type RequestQueryParsedT } from "../middleware/validate-query.js";
import {
	type SelectQueryBuilder,
	type ReferenceExpression,
	type ComparisonOperatorExpression,
} from "kysely";

interface QueryBuilderConfigT<Table extends keyof DB> {
	requestQuery: RequestQueryParsedT;
	meta: {
		filters: {
			queryKey: string; // e.g. "filter[status]" - the object key for the specific filter
			tableKey: ReferenceExpression<DB, Table>; // e.g. "status" - the table column name for the specific filter
			operator: ComparisonOperatorExpression;
		}[];
		sorts: {
			queryKey: string;
			tableKey: ReferenceExpression<DB, Table>;
		}[];
	};
}

const queryBuilder = <Table extends keyof DB>(
	db: SelectQueryBuilder<DB, Table, unknown>,
	config: QueryBuilderConfigT<Table>,
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

		if (Array.isArray(value)) query = query.where(tableKey, "in", value);
		else query = query.where(tableKey, operator, value);
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
