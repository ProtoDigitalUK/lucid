import { sql } from "kysely";
import queryBuilder, {
	type QueryBuilderWhere,
} from "../query-builder/index.js";
import type {
	HeadlessLocales,
	Select,
	BooleanInt,
	KyselyDB,
} from "../db/types.js";

export default class LocalesRepo {
	constructor(private db: KyselyDB) {}

	count = async () => {
		return this.db
			.selectFrom("lucid_locales")
			.select(sql`count(*)`.as("count"))
			.executeTakeFirst() as Promise<{ count: string } | undefined>;
	};
	// ----------------------------------------
	// select
	selectSingle = async <K extends keyof Select<HeadlessLocales>>(props: {
		select: K[];
		where: QueryBuilderWhere<"lucid_locales">;
	}) => {
		let query = this.db.selectFrom("lucid_locales").select<K>(props.select);

		query = queryBuilder.select(query, props.where);

		return query.executeTakeFirst() as Promise<
			Pick<Select<HeadlessLocales>, K> | undefined
		>;
	};
	selectMultiple = async <K extends keyof Select<HeadlessLocales>>(props: {
		select: K[];
		where: QueryBuilderWhere<"lucid_locales">;
	}) => {
		let query = this.db.selectFrom("lucid_locales").select<K>(props.select);

		query = queryBuilder.select(query, props.where);

		return query.execute() as Promise<
			Array<Pick<Select<HeadlessLocales>, K>>
		>;
	};
	selectAll = async <K extends keyof Select<HeadlessLocales>>(props: {
		select: K[];
	}) => {
		return this.db
			.selectFrom("lucid_locales")
			.select<K>(props.select)
			.execute() as Promise<Array<Pick<Select<HeadlessLocales>, K>>>;
	};
	// ----------------------------------------
	// create
	createSingle = async (props: {
		code: string;
	}) => {
		return this.db
			.insertInto("lucid_locales")
			.values({
				code: props.code,
			})
			.returning(["code"])
			.executeTakeFirst();
	};
	createMultiple = async (props: {
		items: Array<{
			code: string;
		}>;
	}) => {
		return this.db
			.insertInto("lucid_locales")
			.values(
				props.items.map((i) => ({
					code: i.code,
				})),
			)
			.execute();
	};
	// ----------------------------------------
	// update
	updateSingle = async (props: {
		where: QueryBuilderWhere<"lucid_locales">;
		data: {
			isDeleted?: BooleanInt;
			isDeletedAt?: string;
			updatedAt?: string;
		};
	}) => {
		let query = this.db
			.updateTable("lucid_locales")
			.set({
				is_deleted: props.data.isDeleted,
				is_deleted_at: props.data.isDeletedAt,
				updated_at: props.data.updatedAt,
			})
			.returning("code");

		query = queryBuilder.update(query, props.where);

		return query.executeTakeFirst();
	};
	// ----------------------------------------
	// delete
	deleteSingle = async (props: {
		where: QueryBuilderWhere<"lucid_locales">;
	}) => {
		let query = this.db.deleteFrom("lucid_locales").returning("code");

		query = queryBuilder.delete(query, props.where);

		return query.executeTakeFirst();
	};
	deleteMultiple = async (props: {
		where: QueryBuilderWhere<"lucid_locales">;
	}) => {
		let query = this.db.deleteFrom("lucid_locales");

		query = queryBuilder.delete(query, props.where);

		return query.execute();
	};
}
