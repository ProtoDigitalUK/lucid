import getDBClient from "@db/db";
// Utils
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

type EmailGetMultiple = (query_instance: SelectQueryBuilder) => Promise<{
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

    // -------------------------------------------
    // Return
    return email.rows[0];
  };
  static getMultiple: EmailGetMultiple = async (query_instance) => {
    const client = await getDBClient;

    const emails = client.query<EmailT>({
      text: `SELECT ${query_instance.query.select} FROM lucid_emails ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
      values: query_instance.values,
    });

    const count = client.query<{ count: string }>({
      text: `SELECT  COUNT(DISTINCT lucid_emails.id) FROM lucid_emails ${query_instance.query.where}`,
      values: query_instance.countValues,
    });

    const data = await Promise.all([emails, count]);

    return {
      data: data[0].rows,
      count: parseInt(data[1].rows[0].count),
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

    const email = await client.query<EmailT>({
      text: `UPDATE 
        lucid_emails 
        SET 
          ${columns.formatted.update} 
        WHERE 
          id = $${aliases.value.length + 1}
        RETURNING *`,
      values: [...values.value, id],
    });

    return email.rows[0];
  };
}
