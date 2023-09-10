export interface EmailResT {
  id: number;
  mail_details: {
    from: {
      address: string | null;
      name: string | null;
    };
    to: string | null;
    subject: string | null;
    cc: null | string;
    bcc: null | string;
    template: string;
  };
  data?: Record<string, any>;
  delivery_status: "sent" | "failed" | "pending";
  type: "external" | "internal";
  email_hash: string;
  sent_count: number;
  html?: string;

  created_at: string;
  updated_at: string;
}
