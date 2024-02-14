export interface EmailResT {
  id: number | null;
  mail_details: {
    from: {
      address: string | null;
      name: string | null;
    };
    to: string | null;
    subject: string | null;
    cc: null | string;
    bcc: null | string;
    template: string | null;
  };
  data?: Record<string, unknown> | null;
  delivery_status: "sent" | "failed" | "pending";
  type: "external" | "internal";
  email_hash: string | null;
  sent_count: number | null;
  error_count: number | null;
  html?: string | null;
  error_message: string | null;

  created_at: string | null;
  last_success_at: string | null;
  last_attempt_at: string | null;
}
