import type { Config } from "../libs/config/config-schema.js";
import type { HeadlessUserTokens } from "../libs/db/types.js";
import type {
	ComparisonOperatorExpression,
	OperandValueExpressionOrList,
} from "kysely";
import type { HeadlessDB } from "../libs/db/types.js";
import { deleteQB, selectQB } from "../libs/db/query-builder.js";

export default class UserTokens {
	constructor(private config: Config) {}

	// dynamic query methods
	getSingle = async (data: {
		select: UserTokenSelectT;
		where: UserTokenWhereT;
	}) => {
		let query = this.config.db.client
			.selectFrom("headless_user_tokens")
			.select(data.select);

		query = selectQB(query, data.where);

		const res = await query.executeTakeFirst();

		return res;
	};
	deleteSingle = async (data: {
		where: UserTokenWhereT;
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

// ------------------------------------------------------------------
// Types
type UserTokenWhereT = Array<{
	key: keyof HeadlessUserTokens;
	operator: ComparisonOperatorExpression;
	value: OperandValueExpressionOrList<
		HeadlessDB,
		"headless_user_tokens",
		keyof HeadlessUserTokens
	>;
}>;
type UserTokenSelectT = Array<keyof HeadlessUserTokens>;
