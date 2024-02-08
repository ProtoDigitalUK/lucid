import { type RequestQueryParsedT } from "../middleware/validate-query.js";
import { type PgSelect } from "drizzle-orm/pg-core";

const queryBuilder = <T extends PgSelect>(
	db: T,
	query: RequestQueryParsedT,
) => {
	// Add function to update query based on db schema, so the name filter for roles would need roles.name adding
	// Update the query based on filters, sorts, includes, excludes, page, and per_page
	// Return the updated query
};

export default queryBuilder;
