import type { HeadlessProcessedImages, Select } from "../libs/db/types.js";
import { sql } from "kysely";
import {
	deleteQB,
	selectQB,
	type QueryBuilderWhereT,
} from "../libs/db/query-builder.js";

export default class ProcessedImagesRepo {
	constructor(private db: DB) {}

	count = async (props: {
		where: QueryBuilderWhereT<"headless_processed_images">;
	}) => {
		let query = this.db
			.selectFrom("headless_processed_images")
			.select(sql`count(*)`.as("count"));

		query = selectQB(query, props.where);

		return query.executeTakeFirst() as Promise<
			{ count: string } | undefined
		>;
	};
	// ----------------------------------------
	// select
	selectMultiple = async <
		K extends keyof Select<HeadlessProcessedImages>,
	>(props: {
		select: K[];
		where: QueryBuilderWhereT<"headless_processed_images">;
	}) => {
		let query = this.db
			.selectFrom("headless_processed_images")
			.select(props.select);

		query = selectQB(query, props.where);

		return query.execute() as Promise<
			Array<Pick<Select<HeadlessProcessedImages>, K>>
		>;
	};
	// ----------------------------------------
	// create
	createSingle = async (props: {
		key: string;
		mediaKey: string;
	}) => {
		return this.db
			.insertInto("headless_processed_images")
			.values({
				key: props.key,
				media_key: props.mediaKey,
			})
			.executeTakeFirst();
	};
	// ----------------------------------------
	// update
	// ----------------------------------------
	// delete
	deleteMultiple = async (props: {
		where: QueryBuilderWhereT<"headless_processed_images">;
	}) => {
		let query = this.db
			.deleteFrom("headless_processed_images")
			.returning("key");

		query = deleteQB(query, props.where);

		return query.execute();
	};
}
