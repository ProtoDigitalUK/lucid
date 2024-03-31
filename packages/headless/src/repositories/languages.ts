import z from "zod";
import { sql } from "kysely";
import type languagesSchema from "../schemas/languages.js";
import type {
	HeadlessLanguages,
	Select,
	BooleanInt,
} from "../libs/db/types.js";
import queryBuilder, {
	deleteQB,
	selectQB,
	updateQB,
	type QueryBuilderWhereT,
} from "../libs/db/query-builder.js";

export default class Languages {
	constructor(private db: DB) {}

	getCount = async () => {
		return this.db
			.selectFrom("headless_languages")
			.select(sql`count(*)`.as("count"))
			.executeTakeFirst() as Promise<{ count: string } | undefined>;
	};
	createSingle = async (props: {
		code: string;
		isDefault: BooleanInt;
		isEnabled: BooleanInt;
	}) => {
		return this.db
			.insertInto("headless_languages")
			.values({
				code: props.code,
				is_default: props.isDefault,
				is_enabled: props.isEnabled,
			})
			.returning(["id", "code"])
			.executeTakeFirst();
	};
	getSingle = async <K extends keyof Select<HeadlessLanguages>>(props: {
		select: K[];
		where: QueryBuilderWhereT<"headless_languages">;
	}) => {
		let query = this.db
			.selectFrom("headless_languages")
			.select<K>(props.select);

		query = selectQB(query, props.where);

		return query.executeTakeFirst() as Promise<
			Pick<Select<HeadlessLanguages>, K> | undefined
		>;
	};
	getMultiple = async <K extends keyof Select<HeadlessLanguages>>(props: {
		select: K[];
		where: QueryBuilderWhereT<"headless_languages">;
	}) => {
		let query = this.db
			.selectFrom("headless_languages")
			.select<K>(props.select);

		query = selectQB(query, props.where);

		return query.execute() as Promise<
			Array<Pick<Select<HeadlessLanguages>, K>>
		>;
	};
	update = async (props: {
		where: QueryBuilderWhereT<"headless_languages">;
		data: {
			code?: HeadlessLanguages["code"];
			isDefault?: HeadlessLanguages["is_default"];
			isEnabled?: HeadlessLanguages["is_enabled"];
			updated_at?: string;
		};
	}) => {
		let query = this.db
			.updateTable("headless_languages")
			.set({
				code: props.data.code,
				is_default: props.data.isDefault,
				is_enabled: props.data.isEnabled,
			})
			.returning("id");

		query = updateQB(query, props.where);

		return query.executeTakeFirst();
	};
	delete = async (props: {
		where: QueryBuilderWhereT<"headless_languages">;
	}) => {
		let query = this.db.deleteFrom("headless_languages").returning("id");

		query = deleteQB(query, props.where);

		return query.execute();
	};
	getMultipleQueryBuilder = async (props: {
		query: z.infer<typeof languagesSchema.getMultiple.query>;
	}) => {
		const languagesQuery = this.db
			.selectFrom("headless_languages")
			.selectAll();

		const languagesCountQuery = this.db
			.selectFrom("headless_languages")
			.select(sql`count(*)`.as("count"));

		const { main, count } = queryBuilder(
			{
				main: languagesQuery,
				count: languagesCountQuery,
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

		return Promise.all([
			main.execute(),
			count?.executeTakeFirst() as Promise<{ count: string } | undefined>,
		]);
	};
}
