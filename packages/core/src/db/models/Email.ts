import getDBClient from "@db/db";
import z from "zod";
// Schema
import emailsSchema from "@schemas/email";
// Utils
import renderTemplate from "@utils/emails/render-template";
import { sendEmailInternal } from "@utils/emails/send-email";
import { LucidError } from "@utils/app/error-handler";
import { queryDataFormat, SelectQueryBuilder } from "@utils/app/query-helpers";

// -------------------------------------------
// Types
type EmailCreateSingle = (data: {
  from_address?: string;
  from_name?: string;
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

type EmailUpdateSingle = (
  id: number,
  data: {
    from_address?: string;
    from_name?: string;
    delivery_status?: "sent" | "failed" | "pending";
  }
) => Promise<EmailT>;

type EmailGetSingle = (id: number) => Promise<EmailT>;
type EmailDeleteSingle = (id: number) => Promise<EmailT>;
type EmailResendSingle = (id: number) => Promise<{
  email: EmailT;
  status: {
    success: boolean;
    message: string;
  };
}>;

// -------------------------------------------
// Media
export type EmailT = {
  id: number;

  from_address: string | null;
  from_name: string | null;
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
    const client = await getDBClient;

    // -------------------------------------------
    // Data
    const {
      from_address,
      from_name,
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
        "from_name",
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
        from_name,
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
    const client = await getDBClient;

    const { filter, sort, page, per_page } = query;

    // Build Query Data and Query
    const SelectQuery = new SelectQueryBuilder({
      columns: [
        "id",
        "from_address",
        "from_name",
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
    const client = await getDBClient;

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
    const client = await getDBClient;

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
  static updateSingle: EmailUpdateSingle = async (id, data) => {
    const client = await getDBClient;

    const { columns, aliases, values } = queryDataFormat({
      columns: ["from_address", "from_name", "delivery_status"],
      values: [data.from_address, data.from_name, data.delivery_status],
      conditional: {
        hasValues: {
          updated_at: new Date().toISOString(),
        },
      },
    });

    const emailRes = await client.query<EmailT>({
      text: `UPDATE 
        lucid_emails 
        SET 
          ${columns.formatted.update} 
        WHERE 
          id = $${aliases.value.length + 1}
        RETURNING *`,
      values: [...values.value, id],
    });

    if (!emailRes.rows[0]) {
      throw new LucidError({
        type: "basic",
        name: "Error updating email",
        message: "There was an error updating the email",
        status: 500,
      });
    }

    return emailRes.rows[0];
  };
  static resendSingle: EmailResendSingle = async (id) => {
    const email = await Email.getSingle(id);

    const status = await sendEmailInternal(
      email.template,
      {
        data: email.data || {},
        options: {
          to: email.to_address || "",
          subject: email.subject || "",
          from: email.from_address || undefined,
          fromName: email.from_name || undefined,
          cc: email.cc || undefined,
          bcc: email.bcc || undefined,
          replyTo: email.from_address || undefined,
        },
      },
      id
    );

    const updatedEmail = await Email.getSingle(id);

    return {
      status,
      email: updatedEmail,
    };
  };
}
