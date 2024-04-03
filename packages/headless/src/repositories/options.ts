import type { HeadlessOptions, Select } from "../libs/db/types.js";
import {
	selectQB,
	updateQB,
	type QueryBuilderWhereT,
} from "../libs/db/query-builder.js";

export default class OptionsRepo {
	constructor(private db: DB) {}

	// ----------------------------------------
	// select
	selectSingle = async <K extends keyof Select<HeadlessOptions>>(props: {
		select: K[];
		where: QueryBuilderWhereT<"headless_options">;
	}) => {
		let query = this.db.selectFrom("headless_options").select(props.select);

		query = selectQB(query, props.where);

		return query.executeTakeFirst() as Promise<
			Pick<Select<HeadlessOptions>, K> | undefined
		>;
	};
	// ----------------------------------------
	// create
	createSingle = async (props: {
		name: HeadlessOptions["name"];
		valueInt?: HeadlessOptions["value_int"];
		valueBool?: HeadlessOptions["value_bool"];
		valueText?: HeadlessOptions["value_text"];
	}) => {
		return this.db
			.insertInto("headless_options")
			.values({
				name: props.name,
				value_bool: props.valueBool,
				value_int: props.valueInt,
				value_text: props.valueText,
			})
			.executeTakeFirst();
	};
	// ----------------------------------------
	// update
	updateSingle = async (props: {
		where: QueryBuilderWhereT<"headless_options">;
		data: {
			valueInt?: HeadlessOptions["value_int"];
			valueBool?: HeadlessOptions["value_bool"];
			valueText?: HeadlessOptions["value_text"];
		};
	}) => {
		let query = this.db
			.updateTable("headless_options")
			.set({
				value_text: props.data.valueText,
				value_int: props.data.valueInt,
				value_bool: props.data.valueBool,
			})
			.returning("name");

		query = updateQB(query, props.where);

		return query.executeTakeFirst();
	};
}
