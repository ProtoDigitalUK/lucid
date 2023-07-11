import nodemailer from "nodemailer";
// Models
import Config from "@db/models/Config";
// Services
import emailsService from "@services/email";

export interface EmailParamsT {
  data: {
    [key: string]: any;
  };
  options?: {
    to: string;
    subject: string;

    from?: string;
    fromName?: string;
    cc?: string;
    bcc?: string;
    replyTo?: string;
  };
}
export interface MailOptionsT {
  to?: string;
  subject?: string;
  from?: string;
  fromName?: string;
  cc?: string;
  bcc?: string;
  replyTo?: string;
}

// -------------------------------------------
// Utility functions
const createEmailRow = async (data: {
  template: string;
  options: MailOptionsT;
  delivery_status: "sent" | "failed" | "pending";
  data: {
    [key: string]: any;
  };
}) => {
  // Save the email to the database
  await emailsService.createSingle({
    from_address: data.options.from,
    from_name: data.options.fromName,
    to_address: data.options.to,
    subject: data.options.subject,
    cc: data.options.cc,
    bcc: data.options.bcc,
    template: data.template,
    data: data.data,
    delivery_status: data.delivery_status,
  });
};

// -------------------------------------------
// Functions

// Handles building the email and sending it
const sendEmailAction = async (
  template: string,
  params: EmailParamsT
): Promise<{
  success: boolean;
  message: string;
  options: MailOptionsT;
}> => {
  let fromName = params.options?.fromName || Config.email?.from?.name;
  let from = params.options?.from || Config.email?.from?.email;

  // Create the email options
  const mailOptions: MailOptionsT = {
    from: from,
    fromName: fromName,
    to: params.options?.to,
    subject: params.options?.subject,
    cc: params.options?.cc,
    bcc: params.options?.bcc,
    replyTo: params.options?.replyTo,
  };

  try {
    const html = await emailsService.renderTemplate(template, params.data);

    // Check if SMTP config exists
    const smptConfig = Config.email?.smtp;
    if (!smptConfig) {
      throw new Error(
        "SMTP config not found. The email has been stored in the database and can be sent manually."
      );
    }

    const transporter = nodemailer.createTransport({
      host: smptConfig.host,
      port: smptConfig.port,
      secure: smptConfig.secure,
      auth: {
        user: smptConfig.user,
        pass: smptConfig.pass,
      },
    });

    // Send the email
    await transporter.sendMail({
      from: `${fromName} <${from}>`,
      to: mailOptions.to,
      subject: mailOptions.subject,
      cc: mailOptions.cc,
      bcc: mailOptions.bcc,
      replyTo: mailOptions.replyTo,
      html: html,
    });

    return {
      success: true,
      message: "Email sent successfully.",
      options: mailOptions,
    };
  } catch (error) {
    const err = error as Error;
    return {
      success: false,
      message: err.message || "Failed to send email.",
      options: mailOptions,
    };
  }
};

// The exported function for the package - allows creating and sending an email
export const sendEmailExternal = async (
  template: string,
  params: EmailParamsT
) => {
  const result = await sendEmailAction(template, params);

  await createEmailRow({
    template: template,
    options: result.options,
    delivery_status: result.success ? "sent" : "failed",
    data: params.data,
  });

  // Return the result
  return {
    success: result.success,
    message: result.message,
  };
};

// Allows creating and updating an email
export const sendEmailInternal = async (
  template: string,
  params: EmailParamsT,
  id?: number
) => {
  const result = await sendEmailAction(template, params);

  if (!id) {
    await createEmailRow({
      template: template,
      options: result.options,
      delivery_status: result.success ? "sent" : "failed",
      data: params.data,
    });
  } else {
    await emailsService.updateSingle({
      id: id,
      data: {
        from_address: result.options.from,
        from_name: result.options.fromName,
        delivery_status: result.success ? "sent" : "failed",
      },
    });
  }

  // Return the result
  return {
    success: result.success,
    message: result.message,
  };
};
