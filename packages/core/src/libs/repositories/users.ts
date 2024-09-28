import { sql } from "kysely";
import queryBuilder, {
	type QueryBuilderWhere,
} from "../query-builder/index.js";
import type z from "zod";
import type { Config } from "../../types/config.js";
import type usersSchema from "../../schemas/users.js";
import type { BooleanInt, LucidUsers, Select, KyselyDB } from "../db/types.js";

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
	selectSingle = async <K extends keyof Select<LucidUsers>>(props: {
		select: K[];
		where: QueryBuilderWhere<"lucid_users">;
	}) => {
		let query = this.db.selectFrom("lucid_users").select(props.select);

		query = queryBuilder.select(query, props.where);

		return query.executeTakeFirst() as Promise<
			Pick<Select<LucidUsers>, K> | undefined
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
				"triggered_password_reset",
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
											.selectFrom("lucid_role_permissions")
											.select(["permission"])
											.whereRef("role_id", "=", "lucid_roles.id"),
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
		K extends keyof Select<LucidUsers>,
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
			.executeTakeFirst() as Promise<Pick<Select<LucidUsers>, K> | undefined>;
	};
	selectMultiple = async <K extends keyof Select<LucidUsers>>(props: {
		select: K[];
		where: QueryBuilderWhere<"lucid_users">;
	}) => {
		let query = this.db.selectFrom("lucid_users").select(props.select);

		query = queryBuilder.select(query, props.where);

		return query.execute() as Promise<Array<Pick<Select<LucidUsers>, K>>>;
	};
	selectMultipleFiltered = async (props: {
		query: z.infer<typeof usersSchema.getMultiple.query>;
		config: Config;
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

		const { main, count } = queryBuilder.main(
			{
				main: usersQuery,
				count: usersCountQuery,
			},
			{
				queryParams: {
					filter: props.query.filter,
					sort: props.query.sort,
					include: props.query.include,
					exclude: props.query.exclude,
					page: props.query.page,
					perPage: props.query.perPage,
				},
				meta: {
					tableKeys: {
						filters: {
							firstName: "lucid_users.first_name",
							lastName: "lucid_users.last_name",
							email: "lucid_users.email",
							username: "lucid_users.username",
							roleIds: "lucid_user_roles.role_id",
							id: "lucid_users.id",
						},
						sorts: {
							createdAt: "lucid_users.created_at",
							updatedAt: "lucid_users.updated_at",
							firstName: "lucid_users.first_name",
							lastName: "lucid_users.last_name",
							email: "lucid_users.email",
							username: "lucid_users.username",
						},
					},
					defaultOperators: {
						firstName: props.config.db.fuzzOperator,
						lastName: props.config.db.fuzzOperator,
						email: props.config.db.fuzzOperator,
						username: props.config.db.fuzzOperator,
					},
				},
			},
		);

		/*

        TODO: turn this into a filter, not sure why it was set up this way in the first place
        		exclude: [
						{
							queryKey: "current",
							tableKey: "lucid_users.id",
							value: props.authId,
							operator: "<>",
						},
					],
        */

		return Promise.all([
			main.execute(),
			count?.executeTakeFirst() as Promise<{ count: string } | undefined>,
		]);
	};
	// ----------------------------------------
	// delete
	deleteMultiple = async (props: {
		where: QueryBuilderWhere<"lucid_users">;
	}) => {
		let query = this.db.deleteFrom("lucid_users").returning("id");

		query = queryBuilder.delete(query, props.where);

		return query.execute();
	};
	// ----------------------------------------
	// update
	updateSingle = async (props: {
		where: QueryBuilderWhere<"lucid_users">;
		data: {
			password?: string;
			updatedAt?: string;
			firstName?: string;
			lastName?: string;
			username?: string;
			superAdmin?: BooleanInt;
			secret?: string;
			email?: string;
			isDeleted?: BooleanInt;
			isDeletedAt?: string;
			deletedBy?: number;
			triggerPasswordReset?: BooleanInt;
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
				secret: props.data.secret,
				super_admin: props.data.superAdmin,
				updated_at: props.data.updatedAt,
				is_deleted: props.data.isDeleted,
				is_deleted_at: props.data.isDeletedAt,
				deleted_by: props.data.deletedBy,
				triggered_password_reset: props.data.triggerPasswordReset,
			})
			.returning(["id", "first_name", "last_name", "email"]);

		query = queryBuilder.update(query, props.where);

		return query.executeTakeFirst();
	};
	// ----------------------------------------
	// create
	createSingle = async (props: {
		superAdmin?: BooleanInt;
		email: string;
		username: string;
		triggerPasswordReset: BooleanInt;
		secret: string;
		firstName?: string;
		lastName?: string;
		password?: string;
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
				secret: props.secret,
				triggered_password_reset: props.triggerPasswordReset,
			})
			.executeTakeFirst();
	};
}
