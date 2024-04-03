import z from "zod";
import { sql } from "kysely";
import { type Config } from "../libs/config/config-schema.js";
import type usersSchema from "../schemas/users.js";
import type { BooleanInt, HeadlessUsers, Select } from "../libs/db/types.js";
import queryBuilder, {
	selectQB,
	updateQB,
	deleteQB,
	type QueryBuilderWhereT,
} from "../libs/db/query-builder.js";

export default class UsersRepo {
	constructor(private db: DB) {}

	count = async () => {
		return this.db
			.selectFrom("headless_users")
			.select(sql`count(*)`.as("count"))
			.executeTakeFirst() as Promise<{ count: string } | undefined>;
	};
	// ----------------------------------------
	// selects
	selectSingle = async <K extends keyof Select<HeadlessUsers>>(props: {
		select: K[];
		where: QueryBuilderWhereT<"headless_users">;
	}) => {
		let query = this.db.selectFrom("headless_users").select(props.select);

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
			.selectFrom("headless_users")
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
							.selectFrom("headless_user_roles")
							.innerJoin(
								"headless_roles",
								"headless_roles.id",
								"headless_user_roles.role_id",
							)
							.select((eb) => [
								"headless_roles.id",
								"headless_roles.name",
								"headless_roles.description",
								props.config.db
									.jsonArrayFrom(
										eb
											.selectFrom(
												"headless_role_permissions",
											)
											.select(["permission"])
											.whereRef(
												"role_id",
												"=",
												"headless_roles.id",
											),
									)
									.as("permissions"),
							])
							.whereRef("user_id", "=", "headless_users.id"),
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
			.selectFrom("headless_users")
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
		where: QueryBuilderWhereT<"headless_users">;
	}) => {
		let query = this.db.selectFrom("headless_users").select(props.select);

		query = selectQB(query, props.where);

		return query.execute() as Promise<
			Array<Pick<Select<HeadlessUsers>, K>>
		>;
	};
	selectMultipleFiltered = async (props: {
		query: z.infer<typeof usersSchema.getMultiple.query>;
		config: Config;
	}) => {
		const usersQuery = this.db
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
				props.config.db
					.jsonArrayFrom(
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
					)
					.as("roles"),
			])
			.leftJoin("headless_user_roles", (join) =>
				join.onRef(
					"headless_user_roles.user_id",
					"=",
					"headless_users.id",
				),
			)
			.where("headless_users.is_deleted", "=", 0);

		const usersCountQuery = this.db
			.selectFrom("headless_users")
			.select(sql`count(*)`.as("count"))
			.leftJoin("headless_user_roles", (join) =>
				join.onRef(
					"headless_user_roles.user_id",
					"=",
					"headless_users.id",
				),
			)
			.where("is_deleted", "=", 0);

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
					per_page: props.query.per_page,
				},
				meta: {
					filters: [
						{
							queryKey: "first_name",
							tableKey: "first_name",
							operator: props.config.db.fuzzOperator,
						},
						{
							queryKey: "last_name",
							tableKey: "last_name",
							operator: props.config.db.fuzzOperator,
						},
						{
							queryKey: "email",
							tableKey: "email",
							operator: props.config.db.fuzzOperator,
						},
						{
							queryKey: "username",
							tableKey: "username",
							operator: props.config.db.fuzzOperator,
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

		return Promise.all([
			main.execute(),
			count?.executeTakeFirst() as Promise<{ count: string } | undefined>,
		]);
	};
	// ----------------------------------------
	// delete
	deleteMultiple = async (props: {
		where: QueryBuilderWhereT<"headless_users">;
	}) => {
		let query = this.db.deleteFrom("headless_users").returning("id");

		query = deleteQB(query, props.where);

		return query.execute();
	};
	// ----------------------------------------
	// update
	updateSingle = async (props: {
		where: QueryBuilderWhereT<"headless_users">;
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
			.updateTable("headless_users")
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
			.insertInto("headless_users")
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
