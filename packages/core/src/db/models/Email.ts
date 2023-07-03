import client from "@db/db";
import z from "zod";
// Utils
import { LucidError } from "@utils/error-handler";
import { queryDataFormat, SelectQueryBuilder } from "@utils/query-helpers";
// Schema
import emailsSchema from "@schemas/email";
// Services
import renderTemplate from "@services/emails/render-template";
import sendEmail from "@services/emails/send-email";

// -------------------------------------------
// Types
type EmailCreateSingle = (data: {
  from_address?: string;
  to_address?: string;
  subject?: string;
  cc?: string;
  bcc?: string;
  template: string;
  delivery_status: "sent" | "failed" | "pending";
  data?: {
    [key: string]: any;
  };
}) => Promise<EmailT>;

type EmailGetMultiple = (
  query: z.infer<typeof emailsSchema.getMultiple.query>
) => Promise<{
  data: EmailT[];
  count: number;
}>;

type EmailGetSingle = (id: number) => Promise<EmailT>;

type EmailDeleteSingle = (id: number) => Promise<EmailT>;

type EmailResendSingle = (id: number) => Promise<{
  success: boolean;
  message: string;
}>;

// -------------------------------------------
// Media
export type EmailT = {
  id: number;

  from_address: string | null;
  to_address: string | null;
  subject: string | null;
  cc: string | null;
  bcc: string | null;

  delivery_status: "sent" | "failed" | "pending";
  template: string;
  data?: {
    [key: string]: any;
  };

  created_at: string;
  updated_at: string;

  html?: string;
};

export default class Email {
  // -------------------------------------------
  // Functions
  static createSingle: EmailCreateSingle = async (data) => {
    // -------------------------------------------
    // Data
    const {
      from_address,
      to_address,
      subject,
      cc,
      bcc,
      template,
      delivery_status,
      data: templateData,
    } = data;

    // -------------------------------------------
    // Save to db
    const { columns, aliases, values } = queryDataFormat({
      columns: [
        "from_address",
        "to_address",
        "subject",
        "cc",
        "bcc",
        "template",
        "data",
        "delivery_status",
      ],
      values: [
        from_address,
        to_address,
        subject,
        cc,
        bcc,
        template,
        templateData,
        delivery_status,
      ],
    });

    const email = await client.query<EmailT>({
      text: `INSERT INTO lucid_emails (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
      values: values.value,
    });

    if (email.rowCount === 0) {
      throw new LucidError({
        type: "basic",
        name: "Email",
        message: "Error saving email",
        status: 500,
      });
    }

    // -------------------------------------------
    // Return
    return email.rows[0];
  };
  static getMultiple: EmailGetMultiple = async (query) => {
    const { filter, sort, page, per_page } = query;

    // Build Query Data and Query
    const SelectQuery = new SelectQueryBuilder({
      columns: [
        "id",
        "from_address",
        "to_address",
        "subject",
        "cc",
        "bcc",
        "template",
        "data",
        "delivery_status",
        "created_at",
        "updated_at",
      ],
      filter: {
        data: filter,
        meta: {
          to_address: {
            operator: "%",
            type: "text",
            columnType: "standard",
          },
          subject: {
            operator: "%",
            type: "text",
            columnType: "standard",
          },
          delivery_status: {
            operator: "ILIKE",
            type: "text",
            columnType: "standard",
          },
        },
      },
      sort: sort,
      page: page,
      per_page: per_page,
    });

    const emails = await client.query<EmailT>({
      text: `SELECT
          ${SelectQuery.query.select}
        FROM
          lucid_emails
        ${SelectQuery.query.where}
        ${SelectQuery.query.order}
        ${SelectQuery.query.pagination}`,
      values: SelectQuery.values,
    });
    const count = await client.query<{ count: number }>({
      text: `SELECT 
          COUNT(DISTINCT lucid_emails.id)
        FROM
          lucid_emails
        ${SelectQuery.query.where} `,
      values: SelectQuery.countValues,
    });

    return {
      data: emails.rows,
      count: count.rows[0].count,
    };
  };
  static getSingle: EmailGetSingle = async (id) => {
    const email = await client.query<EmailT>({
      text: `SELECT
          *
        FROM
          lucid_emails
        WHERE
          id = $1`,
      values: [id],
    });

    if (email.rowCount === 0) {
      throw new LucidError({
        type: "basic",
        name: "Email",
        message: "Email not found",
        status: 404,
      });
    }

    const html = await renderTemplate(
      email.rows[0].template,
      email.rows[0].data || {}
    );
    email.rows[0].html = html;

    return email.rows[0];
  };
  static deleteSingle: EmailDeleteSingle = async (id) => {
    const email = await client.query<EmailT>({
      text: `DELETE FROM
          lucid_emails
        WHERE
          id = $1
        RETURNING *`,
      values: [id],
    });

    if (email.rowCount === 0) {
      throw new LucidError({
        type: "basic",
        name: "Email",
        message: "Email not found",
        status: 404,
      });
    }

    return email.rows[0];
  };
  static resendSingle: EmailResendSingle = async (id) => {
    const email = await Email.getSingle(id);

    // TODO: update this to pass down the email id so we can update the email status
    const sentEmail = await sendEmail(email.template, {
      data: email.data || {},
      options: {
        to: email.to_address || "",
        subject: email.subject || "",

        from: email.from_address || undefined,
        cc: email.cc || undefined,
        bcc: email.bcc || undefined,
      },
    });

    return sentEmail;
  };
}
