import { PoolClient } from "pg";
// Models
import Email from "@db/models/Email.js";
// Utils
import { LucidError } from "@utils/app/error-handler.js";
// Services
import emailService from "@services/email/index.js";

export interface ServiceData {
  id: number;
}

const getSingle = async (client: PoolClient, data: ServiceData) => {
  const email = await Email.getSingle(client, {
    id: data.id,
  });

  if (!email) {
    throw new LucidError({
      type: "basic",
      name: "Email",
      message: "Email not found",
      status: 404,
    });
  }

  const html = await emailService.renderTemplate(
    email.template,
    email.data || {}
  );
  email.html = html;

  return email;
};

export default getSingle;
