import type { QueryBuilderWhere } from "./index.js";
import type { UpdateQueryBuilder } from "kysely";
import type { LucidDB } from "../db/types.js";

const updateQueryBuilder = <
	UT extends keyof LucidDB,
	Table extends keyof LucidDB,
	O,
>(
	query: UpdateQueryBuilder<LucidDB, UT, Table, O>,
	where: QueryBuilderWhere<Table>,
) => {
	let kyselyQuery = query;

	for (const { key, operator, value } of where) {
		kyselyQuery = kyselyQuery.where(key, operator, value);
	}

	return kyselyQuery;
};

export default updateQueryBuilder;
