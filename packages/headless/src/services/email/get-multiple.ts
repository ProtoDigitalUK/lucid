import z from "zod";
import emailSchema from "../../schemas/email.js";
import queryBuilder from "../../db/query-builder.js";
import { sql } from "kysely";
import { parseCount } from "../../utils/app/helpers.js";
import formatEmails from "../../format/format-emails.js";

export interface ServiceData {
	query: z.infer<typeof emailSchema.getMultiple.query>;
}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const emailsQuery = serviceConfig.db
		.selectFrom("headless_emails")
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

	const emailsCountQuery = serviceConfig.db
		.selectFrom("headless_emails")
		.select(sql`count(*)`.as("count"));

	const { main, count } = queryBuilder(
		{
			main: emailsQuery,
			count: emailsCountQuery,
		},
		{
			requestQuery: {
				filter: data.query.filter,
				sort: data.query.sort,
				include: data.query.include,
				exclude: data.query.exclude,
				page: data.query.page,
				per_page: data.query.per_page,
			},
			meta: {
				filters: [
					{
						queryKey: "to_address",
						tableKey: "to_address",
						operator: "=",
					},
					{
						queryKey: "subject",
						tableKey: "subject",
						operator: "%",
					},
					{
						queryKey: "delivery_status",
						tableKey: "delivery_status",
						operator: "=",
					},
					{
						queryKey: "type",
						tableKey: "type",
						operator: "=",
					},
					{
						queryKey: "template",
						tableKey: "template",
						operator: "%",
					},
				],
				sorts: [
					{
						queryKey: "last_attempt_at",
						tableKey: "last_attempt_at",
					},
					{
						queryKey: "last_success_at",
						tableKey: "last_success_at",
					},
					{
						queryKey: "created_at",
						tableKey: "created_at",
					},
					{
						queryKey: "sent_count",
						tableKey: "sent_count",
					},
					{
						queryKey: "error_count",
						tableKey: "error_count",
					},
				],
			},
		},
	);

	const emails = await main.execute();
	const emailsCount = (await count?.executeTakeFirst()) as
		| { count: string }
		| undefined;

	return {
		data: emails.map((email) => formatEmails(email)),
		count: parseCount(emailsCount?.count),
	};
};

export default getMultiple;
