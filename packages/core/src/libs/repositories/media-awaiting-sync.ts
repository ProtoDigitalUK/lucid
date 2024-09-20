import queryBuilder, {
	type QueryBuilderWhere,
} from "../query-builder/index.js";
import type {
	HeadlessMediaAwaitingSync,
	Select,
	KyselyDB,
} from "../db/types.js";

export default class MediaAwaitingSyncRepo {
	constructor(private db: KyselyDB) {}

	// ----------------------------------------
	// select
	selectSingle = async <
		K extends keyof Select<HeadlessMediaAwaitingSync>,
	>(props: {
		select: K[];
		where: QueryBuilderWhere<"lucid_media_awaiting_sync">;
	}) => {
		let query = this.db
			.selectFrom("lucid_media_awaiting_sync")
			.select(props.select);

		query = queryBuilder.select(query, props.where);

		return query.executeTakeFirst() as Promise<
			Pick<Select<HeadlessMediaAwaitingSync>, K> | undefined
		>;
	};
	selectMultiple = async <
		K extends keyof Select<HeadlessMediaAwaitingSync>,
	>(props: {
		select: K[];
		where: QueryBuilderWhere<"lucid_media_awaiting_sync">;
	}) => {
		let query = this.db
			.selectFrom("lucid_media_awaiting_sync")
			.select(props.select);

		query = queryBuilder.select(query, props.where);

		return query.execute() as Promise<
			Array<Pick<Select<HeadlessMediaAwaitingSync>, K>>
		>;
	};
	// ----------------------------------------
	// create
	createSingle = async (props: {
		key: string;
		timestamp: string;
	}) => {
		return this.db
			.insertInto("lucid_media_awaiting_sync")
			.values({
				key: props.key,
				timestamp: props.timestamp,
			})
			.returning("key")
			.executeTakeFirst();
	};
	// ----------------------------------------
	// delete
	deleteSingle = async (props: {
		where: QueryBuilderWhere<"lucid_media_awaiting_sync">;
	}) => {
		let query = this.db
			.deleteFrom("lucid_media_awaiting_sync")
			.returning("key");

		query = queryBuilder.delete(query, props.where);

		return query.executeTakeFirst();
	};
}
