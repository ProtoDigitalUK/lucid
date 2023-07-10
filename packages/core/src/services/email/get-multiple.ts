import z from "zod";
// Models
import Email from "@db/models/Email";
// Schema
import emailsSchema from "@schemas/email";
// Utils
import { SelectQueryBuilder } from "@utils/app/query-helpers";

export interface ServiceData {
  query: z.infer<typeof emailsSchema.getMultiple.query>;
}

const getMultiple = async (data: ServiceData) => {
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

  const emails = await Email.getMultiple(SelectQuery);

  return emails;
};

export default getMultiple;
