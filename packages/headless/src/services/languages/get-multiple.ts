import type z from "zod";
import formatLanguage from "../../format/format-language.js";
import type languagesSchema from "../../schemas/languages.js";
import { parseCount } from "../../utils/helpers.js";
import { sql } from "kysely";
import queryBuilder from "../../libs/db/query-builder.js";

export interface ServiceData {
	query: z.infer<typeof languagesSchema.getMultiple.query>;
}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const languagesQuery = serviceConfig.config.db.client
		.selectFrom("headless_languages")
		.selectAll();

	const languagesCountQuery = serviceConfig.config.db.client
		.selectFrom("headless_languages")
		.select(sql`count(*)`.as("count"));

	const { main, count } = queryBuilder(
		{
			main: languagesQuery,
			count: languagesCountQuery,
		},
		{
			requestQuery: {
				filter: data.query.filter,
				sort: data.query.sort,
				include: data.query.include,
				exclude: data.query.exclude,
				page: data.query.page,
				per_page: data.query.per_page,
			},
			meta: {
				filters: [],
				sorts: [
					{
						queryKey: "code",
						tableKey: "code",
					},
					{
						queryKey: "created_at",
						tableKey: "created_at",
					},
					{
						queryKey: "updated_at",
						tableKey: "updated_at",
					},
				],
			},
		},
	);

	const [languages, languagesCount] = await Promise.all([
		main.execute(),
		count?.executeTakeFirst() as Promise<{ count: string } | undefined>,
	]);

	return {
		data: languages.map((l) => {
			return formatLanguage({
				language: l,
			});
		}),
		count: parseCount(languagesCount?.count),
	};
};

export default getMultiple;
