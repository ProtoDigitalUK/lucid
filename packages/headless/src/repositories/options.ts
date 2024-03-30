import type { Config } from "../libs/config/config-schema.js";
import type { HeadlessOptions, Select } from "../libs/db/types.js";
import {
	selectQB,
	updateQB,
	type QueryBuilderWhereT,
} from "../libs/db/query-builder.js";

export default class Options {
	constructor(private config: Config) {}

	getSingle = <K extends keyof Select<HeadlessOptions>>(props: {
		select: K[];
		where: QueryBuilderWhereT<"headless_options">;
	}) => {
		let query = this.config.db.client
			.selectFrom("headless_options")
			.select(props.select);

		query = selectQB(query, props.where);

		return query.executeTakeFirst() as Promise<
			Pick<Select<HeadlessOptions>, K> | undefined
		>;
	};
	createSingle = (props: {
		name: HeadlessOptions["name"];
		valueInt?: HeadlessOptions["value_int"];
		valueBool?: HeadlessOptions["value_bool"];
		valueText?: HeadlessOptions["value_text"];
	}) => {
		return this.config.db.client
			.insertInto("headless_options")
			.values({
				name: props.name,
				value_bool: props.valueBool,
				value_int: props.valueInt,
				value_text: props.valueText,
			})
			.execute();
	};
	updateSingle = (props: {
		where: QueryBuilderWhereT<"headless_options">;
		data: {
			valueInt?: HeadlessOptions["value_int"];
			valueBool?: HeadlessOptions["value_bool"];
			valueText?: HeadlessOptions["value_text"];
		};
	}) => {
		let query = this.config.db.client.updateTable("headless_options").set({
			value_text: props.data.valueText,
			value_int: props.data.valueInt,
			value_bool: props.data.valueBool,
		});

		query = updateQB(query, props.where);

		return query.executeTakeFirst();
	};
}
