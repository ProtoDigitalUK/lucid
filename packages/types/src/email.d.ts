export interface EmailResT {
	id: number;
	mail_details: {
		from: {
			address: string;
			name: string;
		};
		to: string;
		subject: string;
		cc: null | string;
		bcc: null | string;
		template: string;
	};
	data: unknown | null;
	delivery_status: "sent" | "failed" | "pending";
	type: "external" | "internal";
	email_hash: string;
	sent_count: number;
	error_count: number;
	html: string | null;
	error_message: string | null;

	created_at: string | null;
	last_success_at: string | null;
	last_attempt_at: string | null;
}
