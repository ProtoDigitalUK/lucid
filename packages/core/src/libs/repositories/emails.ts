import type z from "zod";
import type { HeadlessEmails, Select, KyselyDB } from "../db/types.js";
import type { Config } from "../../types/config.js";
import { sql } from "kysely";
import queryBuilder, {
	deleteQB,
	selectQB,
	updateQB,
	type QueryBuilderWhereT,
} from "../db/query-builder.js";
import type emailsSchema from "../../schemas/email.js";

export default class EmailsRepo {
	constructor(private db: KyselyDB) {}

	// ----------------------------------------
	// selects
	selectSingle = async <K extends keyof Select<HeadlessEmails>>(props: {
		select: K[];
		where: QueryBuilderWhereT<"lucid_emails">;
	}) => {
		let query = this.db.selectFrom("lucid_emails").select(props.select);

		query = selectQB(query, props.where);

		return query.executeTakeFirst() as Promise<
			Pick<Select<HeadlessEmails>, K> | undefined
		>;
	};
	selectSingleById = async (props: {
		id: number;
	}) => {
		return this.db
			.selectFrom("lucid_emails")
			.selectAll()
			.where("id", "=", props.id)
			.executeTakeFirst();
	};
	selectMultipleFiltered = async (props: {
		query: z.infer<typeof emailsSchema.getMultiple.query>;
		config: Config;
	}) => {
		const emailsQuery = this.db
			.selectFrom("lucid_emails")
			.select([
				"id",
				"email_hash",
				"from_address",
				"from_name",
				"to_address",
				"subject",
				"cc",
				"bcc",
				"delivery_status",
				"template",
				"type",
				"sent_count",
				"error_count",
				"last_error_message",
				"last_attempt_at",
				"last_success_at",
				"created_at",
			]);

		const emailsCountQuery = this.db
			.selectFrom("lucid_emails")
			.select(sql`count(*)`.as("count"));

		const { main, count } = queryBuilder(
			{
				main: emailsQuery,
				count: emailsCountQuery,
			},
			{
				queryParams: {
					filter: props.query.filter,
					sort: props.query.sort,
					include: props.query.include,
					exclude: props.query.exclude,
					page: props.query.page,
					perPage: props.query.perPage,
				},
				meta: {
					tableKeys: {
						filters: {
							toAddress: "to_address",
							subject: "subject",
							deliveryStatus: "delivery_status",
							type: "type",
							template: "template",
						},
						sorts: {
							lastAttemptAt: "last_attempt_at",
							lastSuccessAt: "last_success_at",
							createdAt: "created_at",
							sentCount: "sent_count",
							errorCount: "error_count",
						},
					},
					defaultOperators: {
						subject: props.config.db.fuzzOperator,
						template: props.config.db.fuzzOperator,
					},
				},
			},
		);

		return Promise.all([
			main.execute(),
			count?.executeTakeFirst() as Promise<{ count: string } | undefined>,
		]);
	};
	// ----------------------------------------
	// create
	createSingle = async (props: {
		emailHash: string;
		fromAddress: string;
		fromName: string;
		toAddress: string;
		subject: string;
		template: string;
		cc?: string;
		bcc?: string;
		data: string | null;
		type: HeadlessEmails["type"];
		sentCount: number;
		errorCount: number;
		deliveryStatus: HeadlessEmails["delivery_status"];
		lastErrorMessage?: string;
		lastSuccessAt?: string;
	}) => {
		return this.db
			.insertInto("lucid_emails")
			.values({
				email_hash: props.emailHash,
				from_address: props.fromAddress,
				from_name: props.fromName,
				to_address: props.toAddress,
				subject: props.subject,
				template: props.template,
				cc: props.cc,
				bcc: props.bcc,
				data: props.data,
				type: props.type,
				sent_count: props.sentCount,
				error_count: props.errorCount,
				delivery_status: props.deliveryStatus,
				last_error_message: props.lastErrorMessage,
				last_success_at: props.lastSuccessAt,
			})
			.returningAll()
			.executeTakeFirst();
	};
	// ----------------------------------------
	// update
	updateSingle = async (props: {
		where: QueryBuilderWhereT<"lucid_emails">;
		data: {
			deliveryStatus?: HeadlessEmails["delivery_status"];
			lastErrorMessage?: string;
			lastSuccessAt?: string;
			sentCount?: number;
			errorCount?: number;
			lastAttemptAt?: string;
		};
	}) => {
		let query = this.db
			.updateTable("lucid_emails")
			.set({
				delivery_status: props.data.deliveryStatus,
				last_error_message: props.data.lastErrorMessage,
				last_success_at: props.data.lastSuccessAt,
				sent_count: props.data.sentCount,
				error_count: props.data.errorCount,
				last_attempt_at: props.data.lastAttemptAt,
			})
			.returningAll();

		query = updateQB(query, props.where);

		return query.executeTakeFirst();
	};
	// ----------------------------------------
	// delete
	deleteSingle = async (props: {
		where: QueryBuilderWhereT<"lucid_emails">;
	}) => {
		let query = this.db.deleteFrom("lucid_emails").returning("id");

		query = deleteQB(query, props.where);

		return query.executeTakeFirst();
	};
}
