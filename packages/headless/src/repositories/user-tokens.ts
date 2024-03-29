import type { Config } from "../libs/config/config-schema.js";
import type { HeadlessUserTokens, HeadlessDB } from "../libs/db/types.js";
import {
	deleteQB,
	selectQB,
	type QueryBuilderWhereT,
} from "../libs/db/query-builder.js";

export default class UserTokens {
	constructor(private config: Config) {}

	// dynamic query methods
	getSingle = async (data: {
		select: Array<keyof HeadlessUserTokens>;
		where: QueryBuilderWhereT<HeadlessDB, "headless_user_tokens">;
	}) => {
		let query = this.config.db.client
			.selectFrom("headless_user_tokens")
			.select(data.select);

		query = selectQB(query, data.where);

		const res = await query.executeTakeFirst();

		return res;
	};
	deleteSingle = async (data: {
		where: QueryBuilderWhereT<HeadlessDB, "headless_user_tokens">;
	}) => {
		let query = this.config.db.client.deleteFrom("headless_user_tokens");

		query = deleteQB(query, data.where);

		const res = await query.execute();

		return res;
	};
	createSingle = async (data: {
		userId: number;
		tokenType: HeadlessUserTokens["token_type"];
		expiryDate: string;
		token: string;
	}) => {
		const res = await this.config.db.client
			.insertInto("headless_user_tokens")
			.values({
				user_id: data.userId,
				token: data.token,
				token_type: data.tokenType,
				expiry_date: data.expiryDate,
			})
			.returning("token")
			.executeTakeFirst();

		return res;
	};
	// fixed query methods
}
