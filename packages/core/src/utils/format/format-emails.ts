// Modale
import { EmailT } from "@db/models/Email.js";
// Types
import { EmailResT } from "@lucid/types/src/email.js";

const formatEmails = (email: EmailT, html?: string): EmailResT => {
  return {
    id: email.id,
    mail_details: {
      from: {
        address: email.from_address,
        name: email.from_name,
      },
      to: email.to_address,
      subject: email.subject,
      cc: email.cc,
      bcc: email.bcc,
      template: email.template,
    },
    data: email.data,
    delivery_status: email.delivery_status,
    type: email.type,
    email_hash: email.email_hash,
    sent_count: email.sent_count,
    html: html,
    created_at: email.created_at,
    updated_at: email.updated_at,
  };
};

export default formatEmails;
