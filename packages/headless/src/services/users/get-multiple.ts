import type z from "zod";
import type usersSchema from "../../schemas/users.js";
import { parseCount } from "../../utils/app/helpers.js";
import { sql } from "kysely";
import queryBuilder from "../../db/query-builder.js";
import formatUser from "../../format/format-user.js";
import { jsonArrayFrom } from "kysely/helpers/postgres";

export interface ServiceData {
	query: z.infer<typeof usersSchema.getMultiple.query>;
}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const usersQuery = serviceConfig.db
		.selectFrom("headless_users")
		.select((eb) => [
			"headless_users.email",
			"headless_users.first_name",
			"headless_users.last_name",
			"headless_users.id",
			"headless_users.created_at",
			"headless_users.updated_at",
			"headless_users.username",
			"headless_users.super_admin",
			jsonArrayFrom(
				eb
					.selectFrom("headless_user_roles")
					.innerJoin(
						"headless_roles",
						"headless_roles.id",
						"headless_user_roles.role_id",
					)
					.select([
						"headless_roles.id",
						"headless_roles.name",
						"headless_roles.description",
					])
					.whereRef("user_id", "=", "headless_users.id"),
			).as("roles"),
		])
		.leftJoin("headless_user_roles", (join) =>
			join.onRef("headless_user_roles.user_id", "=", "headless_users.id"),
		)
		.where("headless_users.is_deleted", "=", false);

	const usersCountQuery = serviceConfig.db
		.selectFrom("headless_users")
		.select(sql`count(*)`.as("count"))
		.leftJoin("headless_user_roles", (join) =>
			join.onRef("headless_user_roles.user_id", "=", "headless_users.id"),
		)
		.where("is_deleted", "=", false);

	const { main, count } = queryBuilder(
		{
			main: usersQuery,
			count: usersCountQuery,
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
						queryKey: "first_name",
						tableKey: "first_name",
						operator: "%",
					},
					{
						queryKey: "last_name",
						tableKey: "last_name",
						operator: "%",
					},
					{
						queryKey: "email",
						tableKey: "email",
						operator: "%",
					},
					{
						queryKey: "username",
						tableKey: "username",
						operator: "%",
					},
					{
						queryKey: "role_ids",
						tableKey: "headless_user_roles.role_id",
						operator: "=",
					},
				],
				sorts: [
					{
						queryKey: "created_at",
						tableKey: "created_at",
					},
					{
						queryKey: "updated_at",
						tableKey: "updated_at",
					},
					{
						queryKey: "first_name",
						tableKey: "first_name",
					},
					{
						queryKey: "last_name",
						tableKey: "last_name",
					},
					{
						queryKey: "email",
						tableKey: "email",
					},
					{
						queryKey: "username",
						tableKey: "username",
					},
				],
			},
		},
	);

	const [users, usersCount] = await Promise.all([
		main.execute(),
		count?.executeTakeFirst() as Promise<{ count: string } | undefined>,
	]);

	return {
		data: users.map(formatUser),
		count: parseCount(usersCount?.count),
	};
};

export default getMultiple;
