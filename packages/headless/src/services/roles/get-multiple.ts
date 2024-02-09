import T from "../../translations/index.js";
import z from "zod";
import { APIError } from "../../utils/app/error-handler.js";
import formatRole from "../../format/format-roles.js";
import rolesSchema from "../../schemas/roles.js";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import queryBuilder from "../../db/query-builder.js";

export interface ServiceData {
	query: z.infer<typeof rolesSchema.getMultiple.query>;
}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const rolesQuery = serviceConfig.db
		.selectFrom("headless_roles")
		.select((eb) => [
			"id",
			"name",
			"created_at",
			"updated_at",
			"description",
			jsonArrayFrom(
				eb
					.selectFrom("headless_role_permissions")
					.select([
						"headless_role_permissions.id",
						"headless_role_permissions.environment_key",
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

	const roles = await queryBuilder(rolesQuery, {
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
	}).execute();

	return roles.map(formatRole);
};

export default getMultiple;
