import type { Config } from "../libs/config/config-schema.js";
import type { HeadlessUserTokens, Select } from "../libs/db/types.js";
import {
	deleteQB,
	selectQB,
	type QueryBuilderWhereT,
} from "../libs/db/query-builder.js";

export default class UserTokens {
	constructor(private config: Config) {}

	getSingle = <K extends keyof Select<HeadlessUserTokens>>(props: {
		select: K[];
		where: QueryBuilderWhereT<"headless_user_tokens">;
	}) => {
		let query = this.config.db.client
			.selectFrom("headless_user_tokens")
			.select<K>(props.select);

		query = selectQB(query, props.where);

		return query.executeTakeFirst() as Promise<
			Pick<Select<HeadlessUserTokens>, K> | undefined
		>;
	};
	delete = (props: {
		where: QueryBuilderWhereT<"headless_user_tokens">;
	}) => {
		let query = this.config.db.client.deleteFrom("headless_user_tokens");

		query = deleteQB(query, props.where);

		return query.execute();
	};
	createSingle = (props: {
		userId: number;
		tokenType: HeadlessUserTokens["token_type"];
		expiryDate: string;
		token: string;
	}) => {
		return this.config.db.client
			.insertInto("headless_user_tokens")
			.values({
				user_id: props.userId,
				token: props.token,
				token_type: props.tokenType,
				expiry_date: props.expiryDate,
			})
			.returning("token")
			.executeTakeFirst();
	};
}
