import { PoolClient } from "pg";
// Models
import Email from "@db/models/Email.js";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
// Services
import emailServices from "@services/email/index.js";
// Format
import formatEmails from "@utils/format/format-emails.js";

export interface ServiceData {
  id: number;
  renderTemplate: boolean;
}

const getSingle = async (client: PoolClient, data: ServiceData) => {
  const email = await Email.getSingle(client, {
    id: data.id,
  });

  if (!email) {
    throw new HeadlessError({
      type: "basic",
      name: "Email",
      message: "Email not found",
      status: 404,
    });
  }

  if (!data.renderTemplate) {
    return formatEmails(email);
  }

  const html = await emailServices.renderTemplate(
    email.template,
    email.data || {}
  );

  return formatEmails(email, html);
};

export default getSingle;
