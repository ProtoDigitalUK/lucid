import type z from "zod";
import { sql } from "kysely";
import type { HeadlessRoles, Select } from "../db/types.js";
import type { Config } from "../config/config-schema.js";
import type rolesSchema from "../../schemas/roles.js";
import queryBuilder, {
	deleteQB,
	selectQB,
	updateQB,
	type QueryBuilderWhereT,
} from "../db/query-builder.js";

export default class RolesRepo {
	constructor(private db: DB) {}

	count = async () => {
		return this.db
			.selectFrom("headless_roles")
			.select(sql`count(*)`.as("count"))
			.executeTakeFirst() as Promise<{ count: string } | undefined>;
	};
	// ----------------------------------------
	// selects
	selectSingle = async <K extends keyof Select<HeadlessRoles>>(props: {
		select: K[];
		where: QueryBuilderWhereT<"headless_roles">;
	}) => {
		let query = this.db.selectFrom("headless_roles").select(props.select);

		query = selectQB(query, props.where);

		return query.executeTakeFirst() as Promise<
			Pick<Select<HeadlessRoles>, K> | undefined
		>;
	};
	selectSingleById = async (props: {
		id: number;
		config: Config;
	}) => {
		return this.db
			.selectFrom("headless_roles")
			.select((eb) => [
				"id",
				"name",
				"created_at",
				"updated_at",
				"description",
				props.config.db
					.jsonArrayFrom(
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
					)
					.as("permissions"),
			])
			.where("id", "=", props.id)
			.executeTakeFirst();
	};
	selectMultiple = async <K extends keyof Select<HeadlessRoles>>(props: {
		select: K[];
		where: QueryBuilderWhereT<"headless_roles">;
	}) => {
		let query = this.db.selectFrom("headless_roles").select(props.select);

		query = selectQB(query, props.where);

		return query.execute() as Promise<
			Array<Pick<Select<HeadlessRoles>, K>>
		>;
	};
	selectMultipleFiltered = async (props: {
		query: z.infer<typeof rolesSchema.getMultiple.query>;
		config: Config;
	}) => {
		let rolesQuery = this.db
			.selectFrom("headless_roles")
			.select(["id", "name", "created_at", "updated_at", "description"]);

		if (props.query.include?.includes("permissions")) {
			rolesQuery = rolesQuery.select((eb) => [
				props.config.db
					.jsonArrayFrom(
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
					)
					.as("permissions"),
			]);
		}

		const rolesCountQuery = this.db
			.selectFrom("headless_roles")
			.select(sql`count(*)`.as("count"));

		const { main, count } = queryBuilder(
			{
				main: rolesQuery,
				count: rolesCountQuery,
			},
			{
				requestQuery: {
					filter: props.query.filter,
					sort: props.query.sort,
					include: props.query.include,
					exclude: props.query.exclude,
					page: props.query.page,
					per_page: props.query.per_page,
				},
				meta: {
					filters: [
						{
							queryKey: "name",
							tableKey: "name",
							operator: props.config.db.fuzzOperator,
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

		return Promise.all([
			main.execute(),
			count?.executeTakeFirst() as Promise<{ count: string } | undefined>,
		]);
	};
	// ----------------------------------------
	// delete
	deleteMultiple = async (props: {
		where: QueryBuilderWhereT<"headless_roles">;
	}) => {
		let query = this.db.deleteFrom("headless_roles").returning("id");

		query = deleteQB(query, props.where);

		return query.execute();
	};
	// ----------------------------------------
	// update
	updateSingle = async (props: {
		where: QueryBuilderWhereT<"headless_roles">;
		data: {
			name?: string;
			description?: string;
			updatedAt?: string;
		};
	}) => {
		let query = this.db
			.updateTable("headless_roles")
			.set({
				name: props.data.name,
				description: props.data.description,
				updated_at: props.data.updatedAt,
			})
			.returning(["id"]);

		query = updateQB(query, props.where);

		return query.executeTakeFirst();
	};
	// ----------------------------------------
	// create
	createSingle = async (props: {
		name: string;
		description?: string;
	}) => {
		return this.db
			.insertInto("headless_roles")
			.values({
				name: props.name,
				description: props.description,
			})
			.returning("id")
			.executeTakeFirst();
	};
}
