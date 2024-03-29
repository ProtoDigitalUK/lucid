import type { Config } from "../libs/config/config-schema.js";
import type { HeadlessUserTokens } from "../libs/db/types.js";

export default class UserTokens {
	constructor(private config: Config) {}

	getSingle = async (data: UserTokensGetSingleT) => {
		const userToken = await this.config.db.client
			.selectFrom("headless_user_tokens")
			.select(["id", "user_id"])
			.where("token", "=", data.token)
			.where("token_type", "=", data.tokenType)
			.where("expiry_date", ">", data.expiryDate)
			.executeTakeFirst();

		return userToken;
	};
	createSingle = async (data: UserTokensCreateSingleT) => {
		const userToken = await this.config.db.client
			.insertInto("headless_user_tokens")
			.values({
				user_id: data.userId,
				token: data.token,
				token_type: data.tokenType,
				expiry_date: data.expiryDate,
			})
			.returning("token")
			.executeTakeFirst();

		return userToken;
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
