import type { Config } from "../libs/config/config-schema.js";
import type {
	HeadlessUserTokens,
	HeadlessDB,
	Select,
} from "../libs/db/types.js";
import {
	deleteQB,
	selectQB,
	type QueryBuilderWhereT,
} from "../libs/db/query-builder.js";

export default class UserTokens {
	constructor(private config: Config) {}

	// dynamic query methods
	getSingle = async <K extends keyof Select<HeadlessUserTokens>>(data: {
		select: K[];
		where: QueryBuilderWhereT<"headless_user_tokens">;
	}) => {
		let query = this.config.db.client
			.selectFrom("headless_user_tokens")
			.select<K>(data.select);

		query = selectQB(query, data.where);

		return query.executeTakeFirst() as Promise<
			Pick<Select<HeadlessUserTokens>, K> | undefined
		>;
	};
	deleteSingle = async (data: {
		where: QueryBuilderWhereT<"headless_user_tokens">;
	}) => {
		let query = this.config.db.client.deleteFrom("headless_user_tokens");

		query = deleteQB(query, data.where);

		return query.execute();
	};
	createSingle = async (data: {
		userId: number;
		tokenType: HeadlessUserTokens["token_type"];
		expiryDate: string;
		token: string;
	}) => {
		return this.config.db.client
			.insertInto("headless_user_tokens")
			.values({
				user_id: data.userId,
				token: data.token,
				token_type: data.tokenType,
				expiry_date: data.expiryDate,
			})
			.returning("token")
			.executeTakeFirst();
	};
	// fixed query methods
}
