import type z from "zod";
import { sql } from "kysely";
import type { HeadlessRoles, Select, KyselyDB } from "../db/types.js";
import type { Config } from "../../types/config.js";
import type rolesSchema from "../../schemas/roles.js";
import queryBuilder, {
	deleteQB,
	selectQB,
	updateQB,
	type QueryBuilderWhereT,
} from "../db/query-builder.js";

export default class RolesRepo {
	constructor(private db: KyselyDB) {}

	count = async () => {
		return this.db
			.selectFrom("lucid_roles")
			.select(sql`count(*)`.as("count"))
			.executeTakeFirst() as Promise<{ count: string } | undefined>;
	};
	// ----------------------------------------
	// selects
	selectSingle = async <K extends keyof Select<HeadlessRoles>>(props: {
		select: K[];
		where: QueryBuilderWhereT<"lucid_roles">;
	}) => {
		let query = this.db.selectFrom("lucid_roles").select(props.select);

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
			.selectFrom("lucid_roles")
			.select((eb) => [
				"id",
				"name",
				"created_at",
				"updated_at",
				"description",
				props.config.db
					.jsonArrayFrom(
						eb
							.selectFrom("lucid_role_permissions")
							.select([
								"lucid_role_permissions.id",
								"lucid_role_permissions.permission",
								"lucid_role_permissions.role_id",
							])
							.whereRef(
								"lucid_role_permissions.role_id",
								"=",
								"lucid_roles.id",
							),
					)
					.as("permissions"),
			])
			.where("id", "=", props.id)
			.executeTakeFirst();
	};
	selectMultiple = async <K extends keyof Select<HeadlessRoles>>(props: {
		select: K[];
		where: QueryBuilderWhereT<"lucid_roles">;
	}) => {
		let query = this.db.selectFrom("lucid_roles").select(props.select);

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
			.selectFrom("lucid_roles")
			.select(["id", "name", "created_at", "updated_at", "description"]);

		if (props.query.include?.includes("permissions")) {
			rolesQuery = rolesQuery.select((eb) => [
				props.config.db
					.jsonArrayFrom(
						eb
							.selectFrom("lucid_role_permissions")
							.select([
								"lucid_role_permissions.id",
								"lucid_role_permissions.permission",
								"lucid_role_permissions.role_id",
							])
							.whereRef(
								"lucid_role_permissions.role_id",
								"=",
								"lucid_roles.id",
							),
					)
					.as("permissions"),
			]);
		}

		const rolesCountQuery = this.db
			.selectFrom("lucid_roles")
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
					perPage: props.query.perPage,
				},
				meta: {
					filters: [
						{
							queryKey: "name",
							tableKey: "name",
							operator: props.config.db.fuzzOperator,
						},
						{
							queryKey: "roleIds",
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
							queryKey: "createdAt",
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
		where: QueryBuilderWhereT<"lucid_roles">;
	}) => {
		let query = this.db.deleteFrom("lucid_roles").returning("id");

		query = deleteQB(query, props.where);

		return query.execute();
	};
	// ----------------------------------------
	// update
	updateSingle = async (props: {
		where: QueryBuilderWhereT<"lucid_roles">;
		data: {
			name?: string;
			description?: string;
			updatedAt?: string;
		};
	}) => {
		let query = this.db
			.updateTable("lucid_roles")
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
			.insertInto("lucid_roles")
			.values({
				name: props.name,
				description: props.description,
			})
			.returning("id")
			.executeTakeFirst();
	};
}
