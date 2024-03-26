import type { EmailResT } from "@headless/types/src/email.js";
import type { JsonValue } from "kysely-codegen";
import { formatDate } from "../utils/format-helpers.js";

interface FormatEmailsT {
	email: {
		id: number;
		email_hash: string;
		from_address: string;
		from_name: string;
		to_address: string;
		subject: string;
		cc: string | null;
		bcc: string | null;
		delivery_status: string;
		template: string;
		type: string;
		sent_count: number;
		error_count: number;
		last_error_message: string | null;
		last_attempt_at: Date | null;
		last_success_at: Date | null;
		created_at: Date | null;
		data?: JsonValue | null;
	};
	html?: string;
}

const formatEmails = (props: FormatEmailsT): EmailResT => {
	return {
		id: props.email.id,
		email_hash: props.email.email_hash,
		type: props.email.type as "external" | "internal",
		delivery_status: props.email.delivery_status as
			| "sent"
			| "failed"
			| "pending",
		mail_details: {
			from: {
				address: props.email.from_address,
				name: props.email.from_name,
			},
			to: props.email.to_address,
			subject: props.email.subject,
			cc: props.email.cc,
			bcc: props.email.bcc,
			template: props.email.template,
		},
		data: (props.email.data as Record<string, unknown> | null) ?? null,
		sent_count: props.email.sent_count || 0,
		error_count: props.email.error_count || 0,
		error_message: props.email.last_error_message,
		html: props.html ?? null,
		last_success_at: formatDate(props.email.last_success_at),
		last_attempt_at: formatDate(props.email.last_attempt_at),
		created_at: formatDate(props.email.created_at),
	};
};

export const swaggerEmailsRes = {
	type: "object",
	properties: {
		id: {
			type: "number",
		},
		email_hash: {
			type: "string",
		},
		type: {
			type: "string",
			enum: ["external", "internal"],
		},
		delivery_status: {
			type: "string",
			enum: ["sent", "failed", "pending"],
		},
		mail_details: {
			type: "object",
			properties: {
				from: {
					type: "object",
					properties: {
						address: {
							type: "string",
						},
						name: {
							type: "string",
						},
					},
				},
				to: {
					type: "string",
				},
				subject: {
					type: "string",
				},
				cc: {
					type: "string",
					nullable: true,
				},
				bcc: {
					type: "string",
					nullable: true,
				},
				template: {
					type: "string",
				},
			},
		},
		data: {
			type: "object",
			nullable: true,
			additionalProperties: true,
		},
		sent_count: {
			type: "number",
		},
		error_count: {
			type: "number",
		},
		error_message: {
			type: "string",
			nullable: true,
		},
		html: {
			type: "string",
			nullable: true,
		},
		last_success_at: {
			type: "string",
			nullable: true,
		},
		last_attempt_at: {
			type: "string",
			nullable: true,
		},
		created_at: {
			type: "string",
			nullable: true,
		},
	},
};

export default formatEmails;
