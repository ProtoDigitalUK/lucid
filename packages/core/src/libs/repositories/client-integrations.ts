import type {
	HeadlessClientIntegrations,
	Select,
	KyselyDB,
	BooleanInt,
} from "../db/types.js";
import {
	deleteQB,
	selectQB,
	updateQB,
	type QueryBuilderWhereT,
} from "../db/query-builder.js";

export default class ClientIntegrationsRepo {
	constructor(private db: KyselyDB) {}

	// ----------------------------------------
	// select
	selectSingle = async <
		K extends keyof Select<HeadlessClientIntegrations>,
	>(props: {
		select: K[];
		where: QueryBuilderWhereT<"lucid_client_integrations">;
	}) => {
		let query = this.db
			.selectFrom("lucid_client_integrations")
			.select(props.select);

		query = selectQB(query, props.where);

		return query.executeTakeFirst() as Promise<
			Pick<Select<HeadlessClientIntegrations>, K> | undefined
		>;
	};
	selectMultiple = async <
		K extends keyof Select<HeadlessClientIntegrations>,
	>(props: {
		select: K[];
		where: QueryBuilderWhereT<"lucid_client_integrations">;
	}) => {
		let query = this.db
			.selectFrom("lucid_client_integrations")
			.select(props.select);

		query = selectQB(query, props.where);

		return query.execute() as Promise<
			Array<Pick<Select<HeadlessClientIntegrations>, K>>
		>;
	};
	// ----------------------------------------
	// create
	createSingle = async (props: {
		name: string;
		description?: string;
		enabled: BooleanInt;
		key: string;
		apiKey: string;
		secret: string;
		createdAt: string;
		updatedAt: string;
	}) => {
		return this.db
			.insertInto("lucid_client_integrations")
			.values({
				name: props.name,
				description: props.description,
				enabled: props.enabled,
				key: props.key,
				api_key: props.apiKey,
				secret: props.secret,
				created_at: props.createdAt,
				updated_at: props.updatedAt,
			})
			.returning(["id", "api_key"])
			.executeTakeFirst();
	};
	// ----------------------------------------
	// update
	updateSingle = async (props: {
		where: QueryBuilderWhereT<"lucid_client_integrations">;
		data: {
			name?: string;
			description?: string;
			enabled?: BooleanInt;
			apiKey?: string;
			secret?: string;
			updatedAt?: string;
		};
	}) => {
		let query = this.db
			.updateTable("lucid_client_integrations")
			.set({
				name: props.data.name,
				description: props.data.description,
				enabled: props.data.enabled,
				api_key: props.data.apiKey,
				secret: props.data.secret,
				updated_at: props.data.updatedAt,
			})
			.returning(["id"]);

		query = updateQB(query, props.where);

		return query.executeTakeFirst();
	};
	// ----------------------------------------
	// delete
	deleteSingle = async (props: {
		where: QueryBuilderWhereT<"lucid_client_integrations">;
	}) => {
		let query = this.db
			.deleteFrom("lucid_client_integrations")
			.returning(["id"]);

		query = deleteQB(query, props.where);

		return query.executeTakeFirst();
	};
}
