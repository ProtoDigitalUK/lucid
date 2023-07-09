import z from "zod";
// Models
import Email from "@db/models/Email";
// Schema
import emailsSchema from "@schemas/email";

interface ServiceData {
  query: z.infer<typeof emailsSchema.getMultiple.query>;
}

const getMultiple = async (data: ServiceData) => {
  const emails = await Email.getMultiple(data.query);

  return emails;
};

export default getMultiple;
