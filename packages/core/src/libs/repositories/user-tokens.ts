import queryBuilder, {
	type QueryBuilderWhere,
} from "../query-builder/index.js";
import type { HeadlessUserTokens, Select, KyselyDB } from "../db/types.js";

export default class UserTokensRepo {
	constructor(private db: KyselyDB) {}

	// ----------------------------------------
	// selects
	selectSingle = async <K extends keyof Select<HeadlessUserTokens>>(props: {
		select: K[];
		where: QueryBuilderWhere<"lucid_user_tokens">;
	}) => {
		let query = this.db
			.selectFrom("lucid_user_tokens")
			.select<K>(props.select);

		query = queryBuilder.select(query, props.where);

		return query.executeTakeFirst() as Promise<
			Pick<Select<HeadlessUserTokens>, K> | undefined
		>;
	};
	// ----------------------------------------
	// delete
	deleteMultiple = async (props: {
		where: QueryBuilderWhere<"lucid_user_tokens">;
	}) => {
		let query = this.db.deleteFrom("lucid_user_tokens");

		query = queryBuilder.delete(query, props.where);

		return query.execute();
	};
	// ----------------------------------------
	// create
	createSingle = async (props: {
		userId: number;
		tokenType: HeadlessUserTokens["token_type"];
		expiryDate: string;
		token: string;
	}) => {
		return this.db
			.insertInto("lucid_user_tokens")
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
