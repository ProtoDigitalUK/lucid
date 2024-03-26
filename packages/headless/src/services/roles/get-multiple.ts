import type z from "zod";
import formatRole from "../../format/format-roles.js";
import type rolesSchema from "../../schemas/roles.js";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import queryBuilder from "../../db/query-builder.js";
import { sql } from "kysely";
import { parseCount } from "../../utils/helpers.js";

export interface ServiceData {
	query: z.infer<typeof rolesSchema.getMultiple.query>;
}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	let rolesQuery = serviceConfig.db
		.selectFrom("headless_roles")
		.select(["id", "name", "created_at", "updated_at", "description"]);

	if (data.query.include?.includes("permissions")) {
		rolesQuery = rolesQuery.select((eb) => [
			jsonArrayFrom(
				eb
					.selectFrom("headless_role_permissions")
					.select([
						"headless_role_permissions.id",
						"headless_role_permissions.permission",
						"headless_role_permissions.role_id",
					])
					.whereRef(
						"headless_role_permissions.role_id",
						"=",
						"headless_roles.id",
					),
			).as("permissions"),
		]);
	}

	const rolesCountQuery = serviceConfig.db
		.selectFrom("headless_roles")
		.select(sql`count(*)`.as("count"));

	const { main, count } = queryBuilder(
		{
			main: rolesQuery,
			count: rolesCountQuery,
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
				filters: [
					{
						queryKey: "name",
						tableKey: "name",
						operator: "%",
					},
					{
						queryKey: "role_ids",
						tableKey: "id",
						operator: "=",
					},
				],
				sorts: [
					{
						queryKey: "name",
						tableKey: "name",
					},
					{
						queryKey: "created_at",
						tableKey: "created_at",
					},
				],
			},
		},
	);

	const [roles, rolesCount] = await Promise.all([
		main.execute(),
		count?.executeTakeFirst() as Promise<{ count: string } | undefined>,
	]);

	return {
		data: roles.map((r) => {
			return formatRole({
				role: r,
			});
		}),
		count: parseCount(rolesCount?.count),
	};
};

export default getMultiple;
