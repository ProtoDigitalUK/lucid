// Utils
import service from "@utils/app/service.js";
// Types
import { ServiceData as EmailParamsT } from "@services/email/send-email.js";
// Services
import emailServices from "@services/email/index.js";

// The exported function for the package - allows creating and sending an email
const sendExternal = async (template: string, params: EmailParamsT) => {
  const result = await emailServices.sendEmail(template, params);

  await service(
    emailServices.createSingle,
    false
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
    type: "external",
  });

  // Return the result
  return {
    success: result.success,
    message: result.message,
  };
};

export default sendExternal;
