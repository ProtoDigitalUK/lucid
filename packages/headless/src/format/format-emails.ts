import { type EmailResT } from "@headless/types/src/email.js";

const formatEmails = (
	email: {
		id: number;
		email_hash: string;
		from_address: string | null;
		from_name: string | null;
		to_address: string | null;
		subject: string | null;
		cc: string | null;
		bcc: string | null;
		delivery_status: string | null;
		template: string | null;
		type: string | null;
		sent_count: number | null;
		error_count: number | null;
		last_error_message: string | null;
		last_attempt_at: Date | null;
		last_success_at: Date | null;
		created_at: Date | null;
		data?: unknown | null;
	},
	html?: string,
): EmailResT => {
	return {
		id: email.id,
		mail_details: {
			from: {
				address: email.from_address,
				name: email.from_name,
			},
			to: email.to_address,
			subject: email.subject,
			cc: email.cc,
			bcc: email.bcc,
			template: email.template,
		},
		data: email.data ?? null,
		delivery_status: email.delivery_status as "sent" | "failed" | "pending",
		type: email.type as "external" | "internal",
		email_hash: email.email_hash,
		sent_count: email.sent_count || 0,
		html: html ?? null,
		created_at: email.created_at?.toISOString() ?? null,
		last_success_at: email.last_success_at?.toISOString() ?? null,
		last_attempt_at: email.last_attempt_at?.toISOString() ?? null,
		error_count: email.error_count || 0,
		error_message: email.last_error_message,
	};
};

export const swaggerEmailsRes = {
	type: "object",
	properties: {
		id: {
			type: "number",
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
				},
				bcc: {
					type: "string",
				},
				template: {
					type: "string",
				},
			},
		},
		data: {
			type: "object",
			properties: {},
		},
		delivery_status: {
			type: "string",
			enum: ["sent", "failed", "pending"],
		},
		type: {
			type: "string",
			enum: ["external", "internal"],
		},
		email_hash: {
			type: "string",
		},
		sent_count: {
			type: "number",
		},
		html: {
			type: "string",
		},
		created_at: {
			type: "string",
		},
		last_success_at: {
			type: "string",
		},
		last_attempt_at: {
			type: "string",
		},
		error_count: {
			type: "number",
		},
		error_message: {
			type: "string",
		},
	},
};

export default formatEmails;
