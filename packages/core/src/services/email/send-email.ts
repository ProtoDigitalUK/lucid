import nodemailer from "nodemailer";
// Services
import Config from "@services/Config.js";
import emailService from "@services/email/index.js";

export interface ServiceData {
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
// export interface MailOptionsT {
//   to?: string;
//   subject?: string;
//   from?: string;
//   fromName?: string;
//   cc?: string;
//   bcc?: string;
//   replyTo?: string;
// }

const sendEmail = async (template: string, params: ServiceData) => {
  let fromName = params.options?.fromName || Config.email?.from?.name;
  let from = params.options?.from || Config.email?.from?.email;

  // Create the email options
  const mailOptions = {
    from: from,
    fromName: fromName,
    to: params.options?.to,
    subject: params.options?.subject,
    cc: params.options?.cc,
    bcc: params.options?.bcc,
    replyTo: params.options?.replyTo,
  };

  try {
    const html = await emailService.renderTemplate(template, params.data);

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
    console.log(error);
    const err = error as Error;
    return {
      success: false,
      message: err.message || "Failed to send email.",
      options: mailOptions,
    };
  }
};

export default sendEmail;
