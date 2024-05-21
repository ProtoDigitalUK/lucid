import type z from "zod";
import { sql } from "kysely";
import type { Config } from "../../types/config.js";
import type usersSchema from "../../schemas/users.js";
import type {
	BooleanInt,
	HeadlessUsers,
	Select,
	KyselyDB,
} from "../db/types.js";
import queryBuilder, {
	selectQB,
	updateQB,
	deleteQB,
	type QueryBuilderWhereT,
} from "../db/query-builder.js";

export default class UsersRepo {
	constructor(private db: KyselyDB) {}

	count = async () => {
		return this.db
			.selectFrom("lucid_users")
			.select(sql`count(*)`.as("count"))
			.executeTakeFirst() as Promise<{ count: string } | undefined>;
	};
	activeCount = async () => {
		return this.db
			.selectFrom("lucid_users")
			.select(sql`count(*)`.as("count"))
			.where("is_deleted", "=", 0)
			.executeTakeFirst() as Promise<{ count: string } | undefined>;
	};
	// ----------------------------------------
	// selects
	selectSingle = async <K extends keyof Select<HeadlessUsers>>(props: {
		select: K[];
		where: QueryBuilderWhereT<"lucid_users">;
	}) => {
		let query = this.db.selectFrom("lucid_users").select(props.select);

		query = selectQB(query, props.where);

		return query.executeTakeFirst() as Promise<
			Pick<Select<HeadlessUsers>, K> | undefined
		>;
	};
	selectSingleById = async (props: {
		id: number;
		config: Config;
	}) => {
		return this.db
			.selectFrom("lucid_users")
			.select((eb) => [
				"email",
				"first_name",
				"last_name",
				"id",
				"created_at",
				"updated_at",
				"username",
				"super_admin",
				props.config.db
					.jsonArrayFrom(
						eb
							.selectFrom("lucid_user_roles")
							.innerJoin(
								"lucid_roles",
								"lucid_roles.id",
								"lucid_user_roles.role_id",
							)
							.select((eb) => [
								"lucid_roles.id",
								"lucid_roles.name",
								"lucid_roles.description",
								props.config.db
									.jsonArrayFrom(
										eb
											.selectFrom(
												"lucid_role_permissions",
											)
											.select(["permission"])
											.whereRef(
												"role_id",
												"=",
												"lucid_roles.id",
											),
									)
									.as("permissions"),
							])
							.whereRef("user_id", "=", "lucid_users.id"),
					)
					.as("roles"),
			])
			.where("id", "=", props.id)
			.where("is_deleted", "=", 0)
			.executeTakeFirst();
	};
	selectSingleByEmailUsername = async <
		K extends keyof Select<HeadlessUsers>,
	>(props: {
		select: K[];
		data: {
			username: string;
			email: string;
		};
	}) => {
		return this.db
			.selectFrom("lucid_users")
			.select(props.select)
			.where((eb) =>
				eb.or([
					eb("username", "=", props.data.username),
					eb("email", "=", props.data.email),
				]),
			)
			.executeTakeFirst() as Promise<
			Pick<Select<HeadlessUsers>, K> | undefined
		>;
	};
	selectMultiple = async <K extends keyof Select<HeadlessUsers>>(props: {
		select: K[];
		where: QueryBuilderWhereT<"lucid_users">;
	}) => {
		let query = this.db.selectFrom("lucid_users").select(props.select);

		query = selectQB(query, props.where);

		return query.execute() as Promise<
			Array<Pick<Select<HeadlessUsers>, K>>
		>;
	};
	selectMultipleFiltered = async (props: {
		query: z.infer<typeof usersSchema.getMultiple.query>;
		config: Config;
		authId: number;
	}) => {
		const usersQuery = this.db
			.selectFrom("lucid_users")
			.select((eb) => [
				"lucid_users.email",
				"lucid_users.first_name",
				"lucid_users.last_name",
				"lucid_users.id",
				"lucid_users.created_at",
				"lucid_users.updated_at",
				"lucid_users.username",
				"lucid_users.super_admin",
				props.config.db
					.jsonArrayFrom(
						eb
							.selectFrom("lucid_user_roles")
							.innerJoin(
								"lucid_roles",
								"lucid_roles.id",
								"lucid_user_roles.role_id",
							)
							.select([
								"lucid_roles.id",
								"lucid_roles.name",
								"lucid_roles.description",
							])
							.whereRef("user_id", "=", "lucid_users.id"),
					)
					.as("roles"),
			])
			.leftJoin("lucid_user_roles", (join) =>
				join.onRef("lucid_user_roles.user_id", "=", "lucid_users.id"),
			)
			.where("lucid_users.is_deleted", "=", 0)
			.groupBy("lucid_users.id");

		const usersCountQuery = this.db
			.selectFrom("lucid_users")
			.select(sql`count(distinct lucid_users.id)`.as("count"))
			.leftJoin("lucid_user_roles", (join) =>
				join.onRef("lucid_user_roles.user_id", "=", "lucid_users.id"),
			)
			.where("lucid_users.is_deleted", "=", 0);

		const { main, count } = queryBuilder(
			{
				main: usersQuery,
				count: usersCountQuery,
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
							queryKey: "firstName",
							tableKey: "lucid_users.first_name",
							operator: props.config.db.fuzzOperator,
						},
						{
							queryKey: "lastName",
							tableKey: "lucid_users.last_name",
							operator: props.config.db.fuzzOperator,
						},
						{
							queryKey: "email",
							tableKey: "lucid_users.email",
							operator: props.config.db.fuzzOperator,
						},
						{
							queryKey: "username",
							tableKey: "lucid_users.username",
							operator: props.config.db.fuzzOperator,
						},
						{
							queryKey: "roleIds",
							tableKey: "lucid_user_roles.role_id",
							operator: "=",
						},
					],
					sorts: [
						{
							queryKey: "createdAt",
							tableKey: "lucid_users.created_at",
						},
						{
							queryKey: "updatedAt",
							tableKey: "lucid_users.updated_at",
						},
						{
							queryKey: "firstName",
							tableKey: "lucid_users.first_name",
						},
						{
							queryKey: "lastName",
							tableKey: "lucid_users.last_name",
						},
						{
							queryKey: "email",
							tableKey: "lucid_users.email",
						},
						{
							queryKey: "username",
							tableKey: "lucid_users.username",
						},
					],
					exclude: [
						{
							queryKey: "current",
							tableKey: "lucid_users.id",
							value: props.authId,
							operator: "<>",
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
		where: QueryBuilderWhereT<"lucid_users">;
	}) => {
		let query = this.db.deleteFrom("lucid_users").returning("id");

		query = deleteQB(query, props.where);

		return query.execute();
	};
	// ----------------------------------------
	// update
	updateSingle = async (props: {
		where: QueryBuilderWhereT<"lucid_users">;
		data: {
			password?: string;
			updatedAt?: string;
			firstName?: string;
			lastName?: string;
			username?: string;
			superAdmin?: BooleanInt;
			email?: string;
			isDeleted?: BooleanInt;
			isDeletedAt?: string;
			deletedBy?: number;
		};
	}) => {
		let query = this.db
			.updateTable("lucid_users")
			.set({
				first_name: props.data.firstName,
				last_name: props.data.lastName,
				username: props.data.username,
				email: props.data.email,
				password: props.data.password,
				super_admin: props.data.superAdmin,
				updated_at: props.data.updatedAt,
				is_deleted: props.data.isDeleted,
				is_deleted_at: props.data.isDeletedAt,
				deleted_by: props.data.deletedBy,
			})
			.returning(["id", "first_name", "last_name", "email"]);

		query = updateQB(query, props.where);

		return query.executeTakeFirst();
	};
	// ----------------------------------------
	// create
	createSingle = async (props: {
		superAdmin?: BooleanInt;
		email: string;
		username: string;
		firstName?: string;
		lastName?: string;
		password: string;
	}) => {
		return this.db
			.insertInto("lucid_users")
			.returning("id")
			.values({
				super_admin: props.superAdmin,
				email: props.email,
				username: props.username,
				first_name: props.firstName,
				last_name: props.lastName,
				password: props.password,
			})
			.executeTakeFirst();
	};
}
