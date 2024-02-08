import T from "../../translations/index.js";
import z from "zod";
import { type RequestQueryParsedT } from "../../middleware/validate-query.js";
import { type PgSelect } from "drizzle-orm/pg-core";
import { APIError } from "../../utils/app/error-handler.js";
import { roles } from "../../db/schema.js";
import { eq, and, inArray } from "drizzle-orm";
import formatRole from "../../format/format-roles.js";
import rolesSchema from "../../schemas/roles.js";

export interface ServiceData {
	query: z.infer<typeof rolesSchema.getMultiple.query>;
}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	let query = serviceConfig.db.select().from(roles).$dynamic();
	query = qbFilters(query, data.query.filter);

	const res = await query.execute();

	console.log(res);
};

const qbFilters = <T extends PgSelect>(
	qb: T,
	filters: RequestQueryParsedT["filter"],
) => {
	return qb.where(and(eq(roles.name, "Admin"), inArray(roles.id, [3])));
};

export default getMultiple;
