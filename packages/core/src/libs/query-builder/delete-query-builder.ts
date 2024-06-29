import type { QueryBuilderWhere } from "./index.js";
import type { DeleteQueryBuilder } from "kysely";
import type { LucidDB } from "../db/types.js";

const deleteQueryBuilder = <Table extends keyof LucidDB, O>(
	query: DeleteQueryBuilder<LucidDB, Table, O>,
	where: QueryBuilderWhere<Table>,
) => {
	let kyselyQuery = query;

	for (const { key, operator, value } of where) {
		kyselyQuery = kyselyQuery.where(key, operator, value);
	}

	return kyselyQuery;
};

export default deleteQueryBuilder;
