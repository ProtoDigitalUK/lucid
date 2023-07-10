// Services
import emails from "@services/email";

export interface ServiceData {
  id: number;
}

const resendSingle = async (data: ServiceData) => {
  const email = await emails.getSingle({
    id: data.id,
  });

  const status = await emails.sendEmailInternal(
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
    data.id
  );

  const updatedEmail = await emails.getSingle({
    id: data.id,
  });

  return {
    status,
    email: updatedEmail,
  };
};

export default resendSingle;
