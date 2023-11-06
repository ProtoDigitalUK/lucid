import { PoolClient } from "pg";
import z from "zod";
// Models
import Email from "@db/models/Email.js";
// Schema
import emailsSchema from "@schemas/email.js";
// Utils
import { SelectQueryBuilder } from "@utils/app/query-helpers.js";
// Format
import formatEmails from "@utils/format/format-emails.js";

export interface ServiceData {
  query: z.infer<typeof emailsSchema.getMultiple.query>;
}

const getMultiple = async (client: PoolClient, data: ServiceData) => {
  const { filter, sort, page, per_page } = data.query;

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
      "type",
      "email_hash",
      "sent_count",
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
          operator: "=",
          type: "text",
          columnType: "standard",
        },
        type: {
          operator: "=",
          type: "text",
          columnType: "standard",
        },
        template: {
          operator: "%",
          type: "text",
          columnType: "standard",
        },
      },
    },
    sort: {
      data: sort,
    },
    page: page,
    per_page: per_page,
  });

  const emails = await Email.getMultiple(client, SelectQuery);

  return {
    data: emails.data.map((email) => formatEmails(email)),
    count: emails.count,
  };
};

export default getMultiple;
