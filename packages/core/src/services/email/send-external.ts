import { getDBClient } from "@db/db.js";
// Utils
import service from "@utils/app/service.js";
// Types
import { ServiceData as EmailParamsT } from "@services/email/send-email.js";
// Services
import emailService from "@services/email/index.js";

// The exported function for the package - allows creating and sending an email
const sendExternal = async (
  template: string,
  params: EmailParamsT,
  track?: boolean
) => {
  const result = await emailService.sendEmail(template, params);

  if (track) {
    const client = await getDBClient();
    try {
      await client.query("BEGIN");
      await service(
        emailService.createSingle,
        false,
        client
      )({
        from_address: result.options.from,
        from_name: result.options.fromName,
        to_address: result.options.to,
        subject: result.options.subject,
        cc: result.options.cc,
        bcc: result.options.bcc,
        template: template,
        data: params.data,
        delivery_status: result.success ? "sent" : "failed",
      });
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  // Return the result
  return {
    success: result.success,
    message: result.message,
  };
};

export default sendExternal;
