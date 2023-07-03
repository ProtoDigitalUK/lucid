"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const Config_1 = __importDefault(require("../../db/models/Config"));
const Email_1 = __importDefault(require("../../db/models/Email"));
const render_template_1 = __importDefault(require("./render-template"));
const sendEmail = async (template, params) => {
    const mailOptions = {
        from: params.options?.from,
        to: params.options?.to,
        subject: params.options?.subject,
        cc: params.options?.cc,
        bcc: params.options?.bcc,
        replyTo: params.options?.replyTo,
        html: "",
    };
    const defaultFrom = Config_1.default.email?.from;
    if (typeof defaultFrom === "string") {
        mailOptions.from = defaultFrom;
    }
    else if (typeof defaultFrom === "object") {
        mailOptions.from = `"${defaultFrom.name}" <${defaultFrom.email}>`;
    }
    try {
        const html = await (0, render_template_1.default)(template, params.data);
        mailOptions.html = html;
        const smptConfig = Config_1.default.email?.smtp;
        if (!smptConfig) {
            throw new Error("SMTP config not found. The email has been stored in the database and can be sent manually.");
        }
        const transporter = nodemailer_1.default.createTransport({
            host: smptConfig.host,
            port: smptConfig.port,
            secure: smptConfig.secure,
            auth: {
                user: smptConfig.user,
                pass: smptConfig.pass,
            },
        });
        await transporter.sendMail(mailOptions);
        await Email_1.default.createSingle({
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
    }
    catch (error) {
        const err = error;
        await Email_1.default.createSingle({
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
exports.default = sendEmail;
//# sourceMappingURL=send-email.js.map