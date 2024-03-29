import type { Config } from "../libs/config/config-schema.js";
import type { HeadlessUserTokens } from "../libs/db/types.js";

export default class UserTokens {
	constructor(private config: Config) {}

	getSingle = async (data: UserTokensGetSingleT) => {
		const res = await this.config.db.client
			.selectFrom("headless_user_tokens")
			.select(["id", "user_id"])
			.where("token", "=", data.token)
			.where("token_type", "=", data.tokenType)
			.where("expiry_date", ">", data.expiryDate)
			.executeTakeFirst();

		return res;
	};
	getSingleValid = async (data: UserTokensGetSingleValidT) => {
		const res = await this.config.db.client
			.selectFrom("headless_user_tokens")
			.select(["id", "user_id"])
			.where("token", "=", data.token)
			.where("token_type", "=", data.tokenType)
			.where("user_id", "=", data.userId)
			.where("expiry_date", ">", data.expiryDate)
			.executeTakeFirst();

		return res;
	};
	createSingle = async (data: UserTokensCreateSingleT) => {
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
	deleteDateLessThan = async (data: UserTokensDeleteDateLessThanT) => {
		const res = await this.config.db.client
			.deleteFrom("headless_user_tokens")
			.where("expiry_date", "<", data.expiryDate)
			.execute();

		return res;
	};
	deleteSingle = async (data: UserTokensDeleteSingleT) => {
		const query = this.config.db.client.deleteFrom("headless_user_tokens");

		if (data.id) {
			query.where("id", "=", data.id);
		}
		if (data.userId) {
			query.where("user_id", "=", data.userId);
		}
		if (data.token) {
			query.where("token", "=", data.token);
		}
		if (data.tokenType) {
			query.where("token_type", "=", data.tokenType);
		}

		const res = await query.execute();

		return res;
	};
}

interface UserTokensGetSingleT {
	token: string;
	tokenType: HeadlessUserTokens["token_type"];
	expiryDate: string;
}

interface UserTokensCreateSingleT {
	userId: number;
	tokenType: HeadlessUserTokens["token_type"];
	expiryDate: string;
	token: string;
}

interface UserTokensDeleteDateLessThanT {
	expiryDate: string;
}

interface UserTokensDeleteSingleT {
	id?: number;
	userId?: number;
	token?: string;
	tokenType?: HeadlessUserTokens["token_type"];
}

interface UserTokensGetSingleValidT {
	token: string;
	tokenType: HeadlessUserTokens["token_type"];
	userId: number;
	expiryDate: string;
}
