import nodemailer from "nodemailer";
// Models
import Config from "@db/models/Config";
import Email from "@db/models/Email";
// Services
import renderTemplate from "./render-template";

interface EmailParamsT {
  data: {
    [key: string]: any;
  };
  options?: {
    to: string;
    subject: string;

    from?: string;
    cc?: string;
    bcc?: string;
    replyTo?: string;
  };
}

const sendEmail = async (template: string, params: EmailParamsT) => {
  // Create the email options
  const mailOptions = {
    from: params.options?.from,
    to: params.options?.to,
    subject: params.options?.subject,
    cc: params.options?.cc,
    bcc: params.options?.bcc,
    replyTo: params.options?.replyTo,
    html: "",
  };
  const defaultFrom = Config.email?.from;
  if (typeof defaultFrom === "string") {
    mailOptions.from = defaultFrom;
  } else if (typeof defaultFrom === "object") {
    mailOptions.from = `"${defaultFrom.name}" <${defaultFrom.email}>`;
  }

  try {
    const html = await renderTemplate(template, params.data);
    mailOptions.html = html;

    // Check if SMTP config exists
    const smptConfig = Config.email?.smtp;
    if (!smptConfig) {
      throw new Error(
        "SMTP config not found. The email has been stored in the database and can be sent manually."
      );
    }

    // Configuring the transporter
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
    await transporter.sendMail(mailOptions);

    // Save the email to the database
    await Email.createSingle({
      from_address: mailOptions.from,
      to_address: mailOptions.to,
      subject: mailOptions.subject,
      cc: mailOptions.cc,
      bcc: mailOptions.bcc,
      template: template,
      data: params.data,
      delivery_status: "sent",
    });

    return {
      success: true,
      message: "Email sent successfully.",
    };
  } catch (error) {
    const err = error as Error;

    await Email.createSingle({
      from_address: mailOptions.from,
      to_address: mailOptions.to,
      subject: mailOptions.subject,
      cc: mailOptions.cc,
      bcc: mailOptions.bcc,
      template: template,
      data: params.data,
      delivery_status: "failed",
    });

    return {
      success: false,
      message: err.message || "Failed to send email.",
    };
  }
};

export default sendEmail;
